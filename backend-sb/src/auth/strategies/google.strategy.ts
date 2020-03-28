import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import mainConfig from '../../config/main.config';
import { UserDataInterface } from '../../interfaces/user-data.interface';
import { User } from '../entities/user.entity';
import { UrlEnums } from '../enums/urls.enum';
import { AuthSourceEnums } from '../enums/auth.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: mainConfig.authProviderSettings.googleId,
      clientSecret: mainConfig.authProviderSettings.googleSecret,
      callbackURL: `${UrlEnums.AUTH_API_URL}/auth/google/callback`,
      profileFields: ['email', 'profileUrl', 'displayName'],
      scope: ['email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: (err: any, result: any) => void) {
    try {
      const userData: UserDataInterface = {
        id: profile.id.toString(),
        email: profile._json.email.toString(),
        displayName: this.getDisplayName(profile).toString(),
        source: AuthSourceEnums.GOOGLE,
      };
      const user: User = await this.authService.authenticateExternalSource(userData);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }

  private getDisplayName(profile: any): Promise<string> {
    if (profile.displayName) {
      return profile.displayName;
    } else {
      return profile._json.email.toString().split('@')[0];
    }
  }
}
