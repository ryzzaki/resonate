import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { UserFacebookRepository } from './repositories/user-facebook.repository';
import { UserGoogleRepository } from './repositories/user-google.repository';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { dynamicJwtConfig } from '../config/jwt.config';
import { passportConfig } from '../config/passport.config';

@Module({
  imports: [
    PassportModule.register(passportConfig),
    JwtModule.register(dynamicJwtConfig),
    TypeOrmModule.forFeature([UserRepository, UserFacebookRepository, UserGoogleRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FacebookStrategy, GoogleStrategy],
  exports: [AuthService, PassportModule, JwtStrategy],
})
export class AuthModule {}
