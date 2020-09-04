import { User } from '../auth/entities/user.entity';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { SpotifyUrlEnums } from 'src/auth/interfaces/urls.enum';
import { SearchQueryDto } from './dto/search-query.dto';
import { WebplayerStateEnum } from './interface/webplayerState.enum';
import axios from 'axios';
import * as qs from 'qs';
import { playData } from './interface/playData';

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
      .catch((e) => {
        this.logger.error(`Unable to authorize Spotify client on ${e} using the current access token!`);
        throw new BadRequestException(`Unable to authorize Spotify client using the current access token!`);
      });
    return response.data;
  }

  async playSongForDeviceId(deviceId: string, data: playData, user: User): Promise<void> {
    const url = `${SpotifyUrlEnums.SPOTIFY_API}/me/player/play?${qs.stringify({
      device_id: deviceId,
    })}`;
    await axios
      .put(url, data, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .catch((e) => {
        this.logger.error(`Unable to authorize Spotify client on ${e} using the current access token!`);
        throw new BadRequestException(`Unable to authorize Spotify client using the current access token!`);
      });
  }

  async updatePlayerState(user: User, playerState: WebplayerStateEnum): Promise<void> {
    const isPause = playerState === WebplayerStateEnum.PAUSE;
    const url = `${SpotifyUrlEnums.SPOTIFY_API}/me/player/${isPause ? 'pause' : 'play'}`;
    await axios
      .put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .catch((e) => {
        this.logger.error(`Unable to authorize Spotify client on ${e} using the current access token!`);
        throw new BadRequestException(`Unable to authorize Spotify client using the current access token!`);
      });
  }

  async updatePlayerRepeatState(deviceId: string, state: boolean, user: User): Promise<void> {
    const url = `${SpotifyUrlEnums.SPOTIFY_API}/me/player/repeat?state=${state ? 'track' : 'off'}&device_id=${deviceId}`;
    await axios
      .put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .catch((e) => {
        this.logger.error(`Unable to authorize Spotify client on ${e} using the current access token!`);
        throw new BadRequestException(`Unable to authorize Spotify client using the current access token!`);
      });
  }

  async getAlbumTracks(user: User, uri: string) {
    const url = `${SpotifyUrlEnums.SPOTIFY_API}/albums/${uri.replace('spotify:album:', '')}/tracks`;
    const res = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .catch((e) => {
        this.logger.error(`Unable to authorize Spotify client on ${e} using the current access token!`);
        throw new BadRequestException(`Unable to authorize Spotify client using the current access token!`);
      });
    return res;
  }

  async getPlaylistTracks(user: User, uri: string) {
    const url = `${SpotifyUrlEnums.SPOTIFY_API}/playlists/${uri.replace('spotify:playlist:', '')}/tracks`;
    const res = await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .catch((e) => {
        this.logger.error(`Unable to authorize Spotify client on ${e} using the current access token!`);
        throw new BadRequestException(`Unable to authorize Spotify client using the current access token!`);
      });
    return res;
  }
}
