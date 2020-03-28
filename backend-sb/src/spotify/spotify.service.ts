import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { SpotifyUrlEnums } from 'src/auth/enums/urls.enum';
import mainConfig from 'src/config/main.config';
import axios from 'axios';
import * as qs from 'qs';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SpotifyService {
  private logger = new Logger('SpotifyService');

  async searchSongs(searchQuery: SearchQueryDto): Promise<string> {
    const auth = await this.getAccess();
    // search and return
    return 'results';
  }

  private async getAccess(): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
  }> {
    const url = `${SpotifyUrlEnums.SPOTIFY_ACCOUNTS}/api/token`;
    const authHeader = Buffer.from(
      `${mainConfig.spotifySettings.clientId}:${mainConfig.spotifySettings.clientSecret}`
    ).toString('base64');
    const grant = qs.stringify({ grant_type: 'client_credentials' });
    const response = await axios
      .post(url, grant, {
        // tslint:disable-next-line: object-literal-key-quotes
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${authHeader}` },
      })
      .catch(e => {
        this.logger.error(`Unable to authorize Spotify client on ${e}`);
        throw new InternalServerErrorException(`Unable to authorize Spotify client`);
      });
    return response.data;
  }
}
