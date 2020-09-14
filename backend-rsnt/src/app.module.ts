import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';
import { typeOrmConfig } from './config/typeorm.config';
import { redisModuleConfig } from './config/redis.config';
import { SpotifyModule } from './spotify/spotify.module';
import { WebplayerModule } from './webplayer/webplayer.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SessionModule } from './session/session.module';
import { GeniusModule } from './genius/genius.module';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    RedisModule.register(redisModuleConfig),
    AuthModule,
    SpotifyModule,
    WebplayerModule,
    SessionModule,
    GeniusModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', './frontend-rsnt/build'),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
