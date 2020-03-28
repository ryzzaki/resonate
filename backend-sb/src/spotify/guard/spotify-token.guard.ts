import { Injectable, CanActivate, ExecutionContext, BadRequestException, Logger } from '@nestjs/common';

@Injectable()
export class SpotifyTokenGuard implements CanActivate {
  private logger = new Logger('SpotifyTokenGuard');

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.verbose('Looking for Spotify Token Cookie');
    const req = context.switchToHttp().getRequest();
    const token: string = req.signedCookies.spotify_tkn;
    return token ? true : false;
  }
}
