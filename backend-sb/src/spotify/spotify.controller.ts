import { Controller, Logger, UseGuards, Get, Query, ValidationPipe } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { AuthGuard } from '@nestjs/passport';
import { SearchQueryDto } from './dto/search-query.dto';

@Controller('/v1/spotify')
@UseGuards(AuthGuard())
export class SpotifyController {
  private logger = new Logger('SpotifyController');

  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('/search')
  searchSongs(@Query(ValidationPipe) searchQuery: SearchQueryDto) {
    this.spotifyService.searchSongs(searchQuery);
  }
}
