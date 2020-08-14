import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-spotify';
import { AuthService } from '../auth.service';
import mainConfig from '../../config/main.config';
import { UserDataInterface } from '../interfaces/userData.interface';
import { User } from '../entities/user.entity';
import { UrlEnums } from '../interfaces/urls.enum';

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy, 'spotify') {
  constructor(private authService: AuthService) {
    super({
      clientID: mainConfig.spotifySettings.clientId,
      clientSecret: mainConfig.spotifySettings.clientSecret,
      callbackURL: `${UrlEnums.API_URL}/auth/spotify/callback`,
      scope: ['user-read-currently-playing', 'user-read-playback-state', 'user-read-email', 'user-read-private', 'streaming'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: IProfile, done: (err: any | null, result: User | boolean) => void) {
    try {
      if (profile._json.product !== 'premium') {
        Logger.error(`User does not have a premium subscription. Web SDK does not work with ${profile._json.product}.`);
        done(null, false);
      }
      const userData: UserDataInterface = {
        userName: profile._json.id,
        email: profile._json.email,
        displayName: profile._json.display_name ? profile._json.display_name : profile._json.id,
        country: profile._json.country,
        subscription: profile._json.product,
      };
      const user = (await this.authService.authenticateOnCallback(userData, accessToken, refreshToken)) as User;
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
