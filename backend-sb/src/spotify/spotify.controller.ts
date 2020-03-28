import { Controller, Logger, UseGuards, Get, Query, ValidationPipe, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { SpotifyService } from './spotify.service';
import { AuthGuard } from '@nestjs/passport';
import { SearchQueryDto } from './dto/search-query.dto';
import { SpotifyTokenGuard } from './guard/spotify-token.guard';

@Controller('/v1/spotify')
@UseGuards(AuthGuard())
export class SpotifyController {
  private logger = new Logger('SpotifyController');

  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('/authenticate')
  getAuthCookie(@Res() res: Response): Promise<void> {
    this.logger.verbose('Authenticating');
    return this.spotifyService.authenticate(res);
  }

  @Get('/search')
  @UseGuards(SpotifyTokenGuard)
  searchSongs(@Query(ValidationPipe) searchQuery: SearchQueryDto, @Req() req: Request): Promise<object> {
    this.logger.verbose('Searching');
    return this.spotifyService.searchSongs(req, searchQuery);
  }
}
