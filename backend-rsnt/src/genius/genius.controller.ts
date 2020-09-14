import { Controller, Get, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { GeniusService } from './genius.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('/v1/genius')
export class GeniusController {
  constructor(private readonly geniusService: GeniusService) {}

  @Get('/lyrics')
  @UseGuards(AuthGuard())
  getLyrics(@Query('q') query: string | undefined): Promise<any> {
    if (!query) {
      throw new BadRequestException(`Query string must not be empty!`);
    }
    return this.geniusService.getLyrics(query);
  }
}
