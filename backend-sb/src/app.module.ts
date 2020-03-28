import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';
import { typeOrmConfig } from './config/typeorm.config';
import { redisModuleConfig } from './config/redis.config';
import { SpotifyModule } from './spotify/spotify.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), RedisModule.register(redisModuleConfig), AuthModule, SpotifyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
