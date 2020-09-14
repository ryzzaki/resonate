import { Controller, UseGuards, Get, Query, ValidationPipe, Put, Body } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { AuthGuard } from '@nestjs/passport';
import { SearchQueryDto } from './dto/search-query.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { WebplayerStateEnum } from './interface/webplayerState.enum';
import { playData } from './interface/playData';

@Controller('/v1/spotify')
@UseGuards(AuthGuard())
export class SpotifyController {
  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('/search')
  @UseGuards(AuthGuard())
  searchSongs(@Query(ValidationPipe) searchQuery: SearchQueryDto, @GetUser() user: User): Promise<object> {
    return this.spotifyService.searchSongs(searchQuery, user);
  }

  @Put('/play')
  @UseGuards(AuthGuard())
  playSongForDeviceId(@Query('deviceId') deviceId: string, @Body() data: playData, @GetUser() user: User) {
    return this.spotifyService.playSongForDeviceId(deviceId, data, user);
  }

  @Put('/pause')
  @UseGuards(AuthGuard())
  pauseSong(@GetUser() user: User) {
    return this.spotifyService.updatePlayerState(user, WebplayerStateEnum.PAUSE);
  }

  @Put('/resume')
  @UseGuards(AuthGuard())
  resumeSong(@GetUser() user: User) {
    return this.spotifyService.updatePlayerState(user, WebplayerStateEnum.PLAY);
  }

  @Put('/repeat')
  @UseGuards(AuthGuard())
  repeatSong(@Query('deviceId') deviceId: string, @Query('state') state: boolean, @GetUser() user: User) {
    return this.spotifyService.updatePlayerRepeatState(deviceId, state, user);
  }
}
