import { Controller, Logger, UseGuards, Get, Query, ValidationPipe, Res } from '@nestjs/common';
import { Response } from 'express';
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
    return this.spotifyService.authenticate(res);
  }

  @Get('/search')
  @UseGuards(SpotifyTokenGuard)
  searchSongs(@Query(ValidationPipe) searchQuery: SearchQueryDto) {
    this.spotifyService.searchSongs(searchQuery);
  }
}
