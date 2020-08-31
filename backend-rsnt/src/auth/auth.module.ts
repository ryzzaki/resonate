import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './repositories/user.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { dynamicJwtConfig } from '../config/jwt.config';
import { passportConfig } from '../config/passport.config';
import { SpotifyStrategy } from './strategies/spotify.strategy';

@Module({
  imports: [PassportModule.register(passportConfig), JwtModule.register(dynamicJwtConfig), TypeOrmModule.forFeature([UserRepository])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, SpotifyStrategy],
  exports: [AuthService, PassportModule, JwtStrategy],
})
export class AuthModule {}
