import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';
import mainConfig from '../../config/main.config';
import { User } from '../entities/user.entity';
import { UserDataInterface } from '../../interfaces/user-data.interface';
import { UrlEnums } from '../enums/urls.enum';
import { AuthSourceEnums } from '../enums/auth.enum';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: mainConfig.authProviderSettings.facebookId,
      clientSecret: mainConfig.authProviderSettings.facebookSecret,
      callbackURL: `${UrlEnums.AUTH_API_URL}/auth/facebook/callback`,
      profileFields: ['id', 'emails', 'displayName'],
      enableProof: true,
      scope: ['email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: (err: any, result: any) => void) {
    try {
      const userData: UserDataInterface = {
        id: profile._json.id.toString(),
        email: profile._json.email.toString(),
        displayName: profile._json.name.toString(),
        source: AuthSourceEnums.FACEBOOK,
      };
      const user: User = await this.authService.authenticateExternalSource(userData);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
