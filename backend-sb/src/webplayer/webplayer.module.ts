import { Module } from '@nestjs/common';
import { WebplayerService } from './webplayer.service';
import { WebplayerGateway } from './webplayer.gateway';
import { AuthModule } from '../auth/auth.module';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [AuthModule, SessionModule],
  providers: [WebplayerService, WebplayerGateway],
})
export class WebplayerModule {}
