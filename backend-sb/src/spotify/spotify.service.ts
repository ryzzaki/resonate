import { Injectable, Logger, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { UrlEnums, SpotifyUrlEnums } from 'src/auth/enums/urls.enum';
import { SearchQueryDto } from './dto/search-query.dto';
import { CallbackDto } from './dto/callback.dto';
import mainConfig from 'src/config/main.config';
import { cookieConfig } from '../config/cookie.config';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class SpotifyService {
  private logger = new Logger('SpotifyService');

  async searchSongs(req: Request, searchQuery: SearchQueryDto): Promise<object> {
    const { accessToken, searchString } = searchQuery;
    const url = `${SpotifyUrlEnums.SPOTIFY_API}/search?${qs.stringify({
      q: searchString,
      type: 'album,track,artist,playlist',
    })}`;
    const response = await axios
      .get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .catch(e => {
        this.logger.error(`Unable to authorize Spotify client on ${e}`);
        throw new InternalServerErrorException(`Unable to authorize Spotify client`);
      });
    return response.data;
  }

  async getAuthCookie(res: Response) {
    const url = `${SpotifyUrlEnums.SPOTIFY_ACCOUNTS}/api/token`;
    const grant = qs.stringify({ grant_type: 'client_credentials' });
    const response = await axios
      .post(url, grant, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // tslint:disable-next-line: object-literal-key-quotes
          Authorization: `Basic ${await this.getBase64AuthHeader()}`,
        },
      })
      .catch(e => {
        this.logger.error(`Unable to authorize Spotify client on ${e}`);
        throw new InternalServerErrorException(`Unable to authorize Spotify client`);
      });
    const cookieData = response.data as SpotifyPayload;
    res
      .cookie('spotify_tkn', cookieData.access_token, {
        maxAge: cookieData.expires_in,
        secure: false,
        signed: true,
        httpOnly: true,
      })
      .status(200)
      .send();
  }

  async callback(res: Response, callbackDto: CallbackDto) {
    const { code, error } = callbackDto;
    if (error === 'access_denied') {
      throw new UnauthorizedException('User denied access to Spotify');
    }
    const url = `${SpotifyUrlEnums.SPOTIFY_ACCOUNTS}/api/token`;
    const grant = qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${UrlEnums.AUTH_API_URL}/spotify/callback`,
    });
    const response = await axios
      .post(url, grant, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // tslint:disable-next-line: object-literal-key-quotes
          Authorization: `Basic ${await this.getBase64AuthHeader()}`,
        },
      })
      .catch(e => {
        this.logger.error(`Unable to authorize Spotify client on ${e}`);
        throw new InternalServerErrorException(`Unable to authorize Spotify client`);
      });
    const cookieData = response.data as SpotifyPayload;
    res
      .cookie('spotify_tkn', cookieData.refresh_token, cookieConfig)
      .status(200)
      .redirect(`${UrlEnums.REDIRECT_URL}/auth/redirect?spotify_access_token=${cookieData.access_token}`);
  }

  async refreshToken(req: Request, res: Response) {
    const refreshTkn = req.signedCookies.spotify_tkn;
    const url = `${SpotifyUrlEnums.SPOTIFY_ACCOUNTS}/api/token`;
    const grant = qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshTkn,
    });
    const response = await axios
      .post(url, grant, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // tslint:disable-next-line: object-literal-key-quotes
          Authorization: `Basic ${await this.getBase64AuthHeader()}`,
        },
      })
      .catch(e => {
        this.logger.error(`Unable to authorize Spotify client on ${e}`);
        throw new InternalServerErrorException(`Unable to authorize Spotify client`);
      });
    res.status(200).send({ access_token: response.data.access_token });
  }

  async login(res: Response) {
    const url = `${SpotifyUrlEnums.SPOTIFY_ACCOUNTS}/authorize?${qs.stringify({
      response_type: 'code',
      client_id: mainConfig.spotifySettings.clientId,
      redirect_uri: `${UrlEnums.AUTH_API_URL}/spotify/callback`,
      scope: 'streaming',
    })}`;
    res.redirect(url);
  }

  private async getBase64AuthHeader(): Promise<string> {
    return Buffer.from(`${mainConfig.spotifySettings.clientId}:${mainConfig.spotifySettings.clientSecret}`).toString(
      'base64'
    );
  }
}

interface SpotifyPayload {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}
