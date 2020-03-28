import { Injectable, UnauthorizedException, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as uuid from 'uuid';
import mainConfig from '../config/main.config';
import { cookieConfig } from '../config/cookie.config';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UserFacebookRepository } from './repositories/user-facebook.repository';
import { UserGoogleRepository } from './repositories/user-google.repository';
import { RedisService } from 'nestjs-redis';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadInterface } from '../interfaces/token-payload.interface';
import { UserDataInterface } from '../interfaces/user-data.interface';
import { UpdateUserDto } from './dto/update.dto';
import { AuthSourceEnums, AuthTypeEnums } from './enums/auth.enum';
import { UrlEnums } from './enums/urls.enum';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(UserFacebookRepository)
    private readonly userFacebookRepository: UserFacebookRepository,
    @InjectRepository(UserGoogleRepository)
    private readonly userGoogleRepository: UserGoogleRepository,
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
      .redirect(String(UrlEnums.REDIRECT_URL));
  }

  async authenticateExternalSource(userData: UserDataInterface): Promise<User> {
    const { id, email, displayName, source } = userData;
    try {
      const user: User = await this.userRepository.externalAuthentication(email, displayName);
      source === AuthSourceEnums.FACEBOOK
        ? await this.userFacebookRepository.createFacebookIdentity(user, id)
        : await this.userGoogleRepository.createGoogleIdentity(user, id);
      return user;
    } catch (error) {
      this.logger.error(`Unable to authenticate from external source on error: ${error}`);
      throw new InternalServerErrorException(`Unable to authenticate from external source on error: ${error}`);
    }
  }

  async sendCredentials(req: Request, res: Response, user: User, source: AuthSourceEnums): Promise<void> {
    const existingToken = req.signedCookies.refresh_tkn_v1;
    if (existingToken) {
      res.clearCookie('refresh_tkn_v1', {
        domain: cookieConfig.domain,
      });
      throw new BadRequestException(`Client is already logged in with an active token`);
    }
    const refreshToken = await this.generateToken(user.id, AuthTypeEnums.REFRESH, user.tokenVer);
    const accessToken = await this.generateToken(user.id, AuthTypeEnums.ACCESS, null);
    if (source === AuthSourceEnums.LOCAL) {
      res
        .cookie('refresh_tkn_v1', refreshToken, cookieConfig)
        .status(200)
        .send({ accessToken });
    } else {
      res.cookie('refresh_tkn_v1', refreshToken, cookieConfig).redirect(`${UrlEnums.REDIRECT_URL}/auth/redirect?access_token=${accessToken}`);
    }
    return;
  }

  async refreshCredentials(req: Request, res: Response): Promise<void> {
    if (!req.signedCookies.refresh_tkn_v1) {
      this.logger.log('Access Denied: no Refresh Token found in cookies');
      throw new UnauthorizedException('Access Denied: no Refresh Token found in cookies');
    }
    const { id, ver } = await this.validateRefreshToken(req.signedCookies.refresh_tkn_v1);
    const refreshToken = await this.generateToken(id, AuthTypeEnums.REFRESH, ver);
    const accessToken = await this.generateToken(id, AuthTypeEnums.ACCESS, null);

    res
      .clearCookie('refresh_tkn_v1', {
        domain: cookieConfig.domain,
      })
      .cookie('refresh_tkn_v1', refreshToken, cookieConfig)
      .status(200)
      .send({ accessToken });
    return;
  }

  async updateUserDetails(updateDetailsDto: UpdateUserDto, user: User): Promise<User> {
    const { displayName } = updateDetailsDto;
    await this.userRepository.updateUserDisplayNameById(user.id, displayName);

    return await this.userRepository.findUserById(user.id);
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findUserById(id);
  }

  async getBasicUserById(id: number): Promise<{ id: number; displayName: string }> {
    const { displayName } = await this.userRepository.findUserById(id);
    return { id, displayName };
  }

  async generateInvitationToken(groupId: number): Promise<string> {
    const payload = { groupId };
    const generatedToken = await this.jwtService.signAsync(payload, {
      expiresIn: '60m',
      jwtid: uuid.v4(),
    });
    return generatedToken;
  }

  private async generateToken(id: number, type: AuthTypeEnums, ver?: number): Promise<string> {
    const payload: TokenPayloadInterface = { id, ver, type };
    const generatedToken = await this.jwtService.signAsync(payload, {
      expiresIn: type === AuthTypeEnums.REFRESH ? mainConfig.serverSettings.refreshTokenAge : '15m',
      jwtid: uuid.v4(),
    });
    return generatedToken;
  }

  async validateInvitationToken(invitationToken: string): Promise<{ jti: string; groupId: number }> {
    try {
      const { jti, groupId } = await this.jwtService.verifyAsync(invitationToken);
      const client = this.redisService.getClient();
      const token: string = await client.get(String(jti));
      if (token) {
        throw new BadRequestException('Token is invalid');
      }
      return { jti, groupId };
    } catch (err) {
      this.logger.error(`Invitation Token validation has failed on error: ${err}`);
      throw new UnauthorizedException(`Invitation Token validation has failed on error: ${err}`);
    }
  }

  async getAllUsersCount(): Promise<{ total: number }> {
    return await this.userRepository.getAllUsersCount();
  }

  async getAllUsersDetail(): Promise<{ total: number; users: User[] }> {
    return await this.userRepository.getAllUsersCount();
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

  private async validateRefreshToken(refreshJwtToken: string): Promise<{ id: number; ver: number }> {
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
}
