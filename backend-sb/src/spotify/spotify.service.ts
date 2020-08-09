import { User } from '../auth/entities/user.entity';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SpotifyUrlEnums } from 'src/auth/interfaces/urls.enum';
import { SearchQueryDto } from './dto/search-query.dto';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class SpotifyService {
  private logger = new Logger('SpotifyService');

  async searchSongs(searchQuery: SearchQueryDto, user: User): Promise<object> {
    const { searchString } = searchQuery;
    const url = `${SpotifyUrlEnums.SPOTIFY_API}/search?${qs.stringify({
      q: searchString,
      type: 'album,track,artist,playlist',
    })}`;
    const response = await axios
      .get(url, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .catch(async e => {
        this.logger.error(`Unable to authorize Spotify client on ${e} using the current refresh token!`);
        throw new UnauthorizedException(`Unable to authorize Spotify client using the current refresh token!`);
      });
    return response.data;
  }
}
