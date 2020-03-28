import { Controller, Logger, UseGuards, Get, Query, ValidationPipe, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { SpotifyService } from './spotify.service';
import { AuthGuard } from '@nestjs/passport';
import { SpotifyTokenGuard } from './guard/spotify-token.guard';
import { SearchQueryDto } from './dto/search-query.dto';
import { CallbackDto } from './dto/callback.dto';

@Controller('/v1/spotify')
@UseGuards(AuthGuard())
export class SpotifyController {
  private logger = new Logger('SpotifyController');

  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('/login')
  login(@Res() res: Response): Promise<void> {
    this.logger.verbose('Login');
    return this.spotifyService.login(res);
  }

  @Get('/callback')
  callback(@Query() callbackDto: CallbackDto, @Res() res: Response): Promise<void> {
    this.logger.verbose('Callback');
    return this.spotifyService.callback(res, callbackDto);
  }

  @Get('/refresh')
  @UseGuards(SpotifyTokenGuard)
  refreshToken(@Req() req: Request, @Res() res: Response): Promise<void> {
    this.logger.verbose('Refresh');
    return this.spotifyService.refreshToken(req, res);
  }

  @Get('/search')
  @UseGuards(SpotifyTokenGuard)
  searchSongs(@Query(ValidationPipe) searchQuery: SearchQueryDto): Promise<object> {
    this.logger.verbose('Searching');
    return this.spotifyService.searchSongs(searchQuery);
  }
}
