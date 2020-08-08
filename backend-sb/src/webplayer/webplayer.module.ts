import { Module } from '@nestjs/common';
import { WebplayerService } from './webplayer.service';
import { WebplayerGateway } from './webplayer.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [WebplayerService, WebplayerGateway],
})
export class WebplayerModule {}
