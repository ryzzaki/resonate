import { Module } from '@nestjs/common';
import { GeniusService } from './genius.service';
import { GeniusController } from './genius.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [GeniusService],
  exports: [GeniusService],
  controllers: [GeniusController],
})
export class GeniusModule {}
