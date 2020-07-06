import { Controller, Logger, UseGuards, Get, Query, ValidationPipe } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { AuthGuard } from '@nestjs/passport';
import { SearchQueryDto } from './dto/search-query.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('/v1/spotify')
@UseGuards(AuthGuard())
export class SpotifyController {
  private logger = new Logger('SpotifyController');

  constructor(private readonly spotifyService: SpotifyService) {}

  @Get('/search')
  @UseGuards(AuthGuard())
  searchSongs(@Query(ValidationPipe) searchQuery: SearchQueryDto, @GetUser() user: User): Promise<object> {
    return this.spotifyService.searchSongs(searchQuery, user);
  }
}
