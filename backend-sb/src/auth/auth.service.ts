import { Injectable, UnauthorizedException, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
import mainConfig from '../config/main.config';
import { cookieConfig } from '../config/cookie.config';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { RedisService } from 'nestjs-redis';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadInterface } from './interfaces/tokenPayload.interface';
import { UserDataInterface } from './interfaces/userData.interface';
import { SpotifyPayloadInterface } from './interfaces/spotifyPayload.interface';
import { UpdateUserDto } from './dto/update.dto';
import { AuthTypeEnums } from './interfaces/auth.enum';
import { UrlEnums, SpotifyUrlEnums } from './interfaces/urls.enum';
import axios from 'axios';
import * as qs from 'qs';
import * as uuid from 'uuid';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService
  ) {}

  async signOutUser(req: Request, res: Response): Promise<void> {
    const existingToken: string = req.signedCookies.refresh_tkn_v1;
    if (!existingToken) {
      this.logger.log('Token not found in signed cookies');
      throw new BadRequestException('Token not found in signed cookies');
    }
    await this.blackListToken(existingToken);
    res
      .clearCookie('refresh_tkn_v1', {
        domain: cookieConfig.domain,
      })
      .redirect(String(UrlEnums.BASE_URL));
  }

  async authenticateOnCallback(userData: UserDataInterface, accessToken: string, refreshToken: string): Promise<User> {
    const { email, userName, displayName, country, subscription } = userData;
    try {
      const user: User = await this.userRepository.externalAuthentication(
        email,
        userName,
        displayName,
        country,
        subscription,
        accessToken,
        refreshToken
      );
      return user;
    } catch (error) {
      this.logger.error(`Unable to authenticate from external source on error: ${error}`);
      throw new InternalServerErrorException(`Unable to authenticate from external source on error: ${error}`);
    }
  }

  async sendCredentials(req: Request, res: Response, user: User): Promise<void> {
    const existingToken = req.signedCookies.refresh_tkn_v1;
    if (existingToken) {
      await this.validateRefreshToken(existingToken);
      await this.blackListToken(existingToken);
      res.clearCookie('refresh_tkn_v1', {
        domain: cookieConfig.domain,
      });
    }
    const refreshToken = await this.generateToken(user.id, AuthTypeEnums.REFRESH, user.tokenVer);
    const accessToken = await this.generateToken(user.id, AuthTypeEnums.ACCESS);
    res.cookie('refresh_tkn_v1', refreshToken, cookieConfig).status(302).redirect(`${UrlEnums.BASE_URL}/auth/#access_token=${accessToken}`);
    return;
  }

  async refreshCredentials(req: Request, res: Response): Promise<void> {
    if (!req.signedCookies.refresh_tkn_v1) {
      this.logger.log('Access Denied: no Refresh Token found in cookies');
      throw new UnauthorizedException('Access Denied: no Refresh Token found in cookies');
    }
    const { id, ver } = await this.validateRefreshToken(req.signedCookies.refresh_tkn_v1);
    const user = await this.userRepository.getUserById(id);
    const refreshToken = await this.generateToken(id, AuthTypeEnums.REFRESH, ver);
    const accessToken = await this.generateToken(id, AuthTypeEnums.ACCESS);
    // refresh the spotify tokens
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.refreshSpotifyTokens(user.refreshToken);
    await this.userRepository.updateUserSpotifyTokensById(user.id, newAccessToken, newRefreshToken ? newRefreshToken : user.refreshToken);
    res
      .clearCookie('refresh_tkn_v1', {
        domain: cookieConfig.domain,
      })
      .cookie('refresh_tkn_v1', refreshToken, cookieConfig)
      .status(200)
      .send({ accessToken, spotifyAccessToken: newAccessToken });
    return;
  }

  async updateUserDetails(updateDetailsDto: UpdateUserDto, user: User): Promise<User> {
    const { displayName } = updateDetailsDto;
    await this.userRepository.updateUserDisplayNameById(user.id, displayName);
    return this.userRepository.getUserById(user.id);
  }

  async getUserById(id: string): Promise<User> {
    return await this.userRepository.getUserById(id);
  }

  async getBasicUserById(id: string): Promise<{ id: string; displayName: string }> {
    const { displayName } = await this.userRepository.getUserById(id);
    return { id, displayName };
  }

  private async generateToken(id: string, type: AuthTypeEnums, ver?: number): Promise<string> {
    const payload: TokenPayloadInterface = { id, ver, type };
    const generatedToken = await this.jwtService.signAsync(payload, {
      expiresIn: type === AuthTypeEnums.REFRESH ? mainConfig.serverSettings.refreshTokenAge : '1h',
      jwtid: uuid.v4(),
    });
    return generatedToken;
  }

  async getAllUsersCount(): Promise<{ total: number }> {
    return await this.userRepository.getAllUsersCount();
  }

  async getAllUsersDetail(): Promise<{ total: number; users: User[] }> {
    return await this.userRepository.getAllUsersCount();
  }

  async decodeTokenPayload(token: string): Promise<TokenPayloadInterface> {
    return this.jwtService.decode(token) as TokenPayloadInterface;
  }

  private async blackListToken(blackListedToken: string): Promise<void> {
    const client = this.redisService.getClient();
    const { jti, exp }: any = this.jwtService.decode(blackListedToken);
    const expirationTime: number = Number(exp) - Date.now() / 1000;
    client.set(jti, blackListedToken, 'EX', Math.floor(expirationTime), (err: Error, result: string) => {
      if (err) {
        this.logger.error('Redis Client Error: ' + err.message);
        throw new InternalServerErrorException('Redis Client Error: ' + err.message);
      }
      return;
    });
  }

  private async validateRefreshToken(refreshJwtToken: string): Promise<{ id: string; ver: number }> {
    try {
      const { jti, id, ver } = await this.jwtService.verifyAsync(refreshJwtToken);
      const client = this.redisService.getClient();
      const token: string = await client.get(String(jti));
      if (token) {
        throw new BadRequestException('Token is invalid');
      }
      return { id, ver };
    } catch (err) {
      this.logger.error(`Refresh Token validation has failed on error: ${err}`);
      throw new UnauthorizedException(`Refresh Token validation has failed on error: ${err}`);
    }
  }

  private async refreshSpotifyTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const url = `${SpotifyUrlEnums.SPOTIFY_ACCOUNTS}/api/token`;
    const grant = qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
    const responseData = (
      await axios
        .post(url, grant, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${await this.getBase64AuthHeader()}`,
          },
        })
        .catch((e) => {
          this.logger.error(`Unable to authorize Spotify client on ${e}`);
          throw new InternalServerErrorException(`Unable to authorize Spotify client`);
        })
    ).data as SpotifyPayloadInterface;
    return { accessToken: responseData.access_token, refreshToken: responseData.refresh_token };
  }

  private async getBase64AuthHeader(): Promise<string> {
    return Buffer.from(`${mainConfig.spotifySettings.clientId}:${mainConfig.spotifySettings.clientSecret}`).toString('base64');
  }
}
