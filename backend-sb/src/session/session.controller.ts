import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Param } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/createSession.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { Session } from './interfaces/session.interface';

@Controller('/v1/session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  getAllPublicSessions(): Promise<Session[]> {
    // do not ever return the private rooms
    // getting all public rooms is not guarded
    return this.sessionService.getAllPublicSessions();
  }

  @Post()
  @UseGuards(AuthGuard())
  createSession(@Body(ValidationPipe) createSessionDto: CreateSessionDto, @GetUser() user: User): Promise<Session> {
    return this.sessionService.createSession(createSessionDto, user);
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  getSessionById(@Param('id') id: string): Promise<Session> {
    return this.sessionService.getSessionById(id);
  }
}
