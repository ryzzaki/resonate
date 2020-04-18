import { User } from '../auth/entities/user.entity';
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { SpotifyUrlEnums } from 'src/auth/enums/urls.enum';
import { SearchQueryDto } from './dto/search-query.dto';
import mainConfig from 'src/config/main.config';
import axios from 'axios';
import * as qs from 'qs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SpotifyService {
  private logger = new Logger('SpotifyService');

  constructor(private readonly authService: AuthService) {}

  async searchSongs(searchQuery: SearchQueryDto, user: User): Promise<object> {
    const { accessToken, searchString } = searchQuery;
    const url = `${SpotifyUrlEnums.SPOTIFY_API}/search?${qs.stringify({
      q: searchString,
      type: 'album,track,artist,playlist',
    })}`;
    const response = await axios
      .get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .catch(async e => {
        if (e.response.status === 401 || e.response.status === 403) {
          const credentials = await this.refreshToken(user.refreshToken);
          await this.authService.setSpotifyRefreshToken(user.id, credentials.refreshToken);
        }
        this.logger.error(`Unable to authorize Spotify client on ${e}`);
        throw new InternalServerErrorException(`Unable to authorize Spotify client`);
      });
    return response.data;
  }

  async refreshToken(refreshTkn: string): Promise<{ accessToken: string; refreshToken: string }> {
    const url = `${SpotifyUrlEnums.SPOTIFY_ACCOUNTS}/api/token`;
    const grant = qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshTkn,
    });
    const response = (
      await axios
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
        })
    ).data as SpotifyPayload;
    return { accessToken: response.access_token, refreshToken: response.refresh_token };
  }

  private async getBase64AuthHeader(): Promise<string> {
    return Buffer.from(`${mainConfig.spotifySettings.clientId}:${mainConfig.spotifySettings.clientSecret}`).toString('base64');
  }
}

interface SpotifyPayload {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}
