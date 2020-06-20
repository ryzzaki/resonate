import { Injectable, BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-spotify';
import { AuthService } from '../auth.service';
import mainConfig from '../../config/main.config';
import { UserDataInterface } from '../../interfaces/user-data.interface';
import { User } from '../entities/user.entity';
import { UrlEnums } from '../enums/urls.enum';

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy, 'spotify') {
  constructor(private authService: AuthService) {
    super({
      clientID: mainConfig.spotifySettings.clientId,
      clientSecret: mainConfig.spotifySettings.clientSecret,
      callbackURL: `${UrlEnums.API_URL}/auth/spotify/callback`,
      scope: ['user-read-email', 'user-read-private', 'streaming'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: IProfile, done: (err: any, result: any) => void) {
    try {
      if (profile._json.product !== 'premium') {
        done(null, false);
        throw new BadRequestException(`User does not have a premium subscription. Web SDK does not work with ${profile._json.product}.`);
      }
      const userData: UserDataInterface = {
        userName: profile._json.id,
        email: profile._json.email,
        displayName: profile._json.display_name ? profile._json.display_name : profile._json.id,
        country: profile._json.country,
        subscription: profile._json.product,
      };
      const user: User = await this.authService.authenticateOnCallback(userData, refreshToken);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}

interface IProfile {
  _json: {
    country: string;
    display_name: string | undefined;
    email: string;
    href: string;
    id: string;
    product: string;
    uri: string;
  };
}