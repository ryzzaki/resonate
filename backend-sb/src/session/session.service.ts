import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { CreateSessionDto } from './dto/createSession.dto';
import { Session } from './interfaces/session.interface';
import { RoomAccess } from './interfaces/roomAccess.enum';
import { User } from '../auth/entities/user.entity';
import * as Redis from 'ioredis';
import * as uuid from 'uuid';
import * as _ from 'lodash';

@Injectable()
export class SessionService {
  private logger = new Logger('SessionService');

  private readonly redisClient: Redis.Redis | undefined;

  constructor(private readonly redisService: RedisService) {
    this.redisClient = this.redisService.getClient();
  }

  private readonly defaultSongURIs: string[] = [
    'spotify:track:7qEKqBCD2vE5vIBsrUitpD',
    'spotify:track:6VrLYoQKdhu1Jruei06t65',
    'spotify:track:6QgjcU0zLnzq5OrUoSZ3OK',
    'spotify:track:2GiJYvgVaD2HtM8GqD9EgQ',
  ];

  async createSession(createSessionDto: CreateSessionDto, user: User): Promise<Session> {
    const { name, description, roomAccess } = createSessionDto;
    const omittedVarUser = _.omit(user, ['email', 'accessToken', 'refreshToken', 'subscription', 'tokenVer']);
    const newSession: Session = {
      id: uuid.v4(),
      name,
      description,
      roomAccess,
      currentDJ: omittedVarUser,
      uris: [_.sample(this.defaultSongURIs)],
      connectedUsers: [],
      startsAt: Date.now(),
      endsAt: Date.now() + 10 * 60 * 1000,
      webplayer: {
        uri: '',
        songStartedAt: Date.now(),
      },
      chat: [],
    };
    this.redisClient.set(`session:${newSession.id}`, JSON.stringify(newSession), 'EX', 86400, (err, result) => {
      if (err) {
        this.logger.error('Redis Client Error: ' + err.message);
        throw new InternalServerErrorException('Redis Client Error: ' + err.message);
      }
      return;
    });
    return newSession;
  }

  async getAllPublicSessions(): Promise<Session[]> {
    let scanResult: [string, string[]];
    try {
      scanResult = await this.redisClient.scan(0, 'match', 'session:*', 'count', 1000);
      const sessions: Session[] = [];
      for (const sessionId of scanResult[1]) {
        const fetchedSession: Session | undefined = JSON.parse(await this.redisClient.get(sessionId));
        if (fetchedSession && fetchedSession.roomAccess === RoomAccess.PUBLIC) {
          sessions.push(fetchedSession);
        }
      }
      return sessions;
    } catch (e) {
      this.logger.error(`Error during session fetching on: ${e}`);
      throw new InternalServerErrorException(`Error during session fetching on: ${e}`);
    }
  }

  async getSessionById(id: string): Promise<Session> {
    try {
      const session: Session = JSON.parse(await this.redisClient.get(`session:${id}`));
      return session as Session;
    } catch (e) {
      this.logger.error(`Session ID ${id} does not exist! Trace: ${e}`);
      throw new BadRequestException(`Session ID ${id} does not exist! Trace: ${e}`);
    }
  }

  async updateSession(session: Session): Promise<Session> {
    try {
      await this.redisClient.set(`session:${session.id}`, JSON.stringify(session), 'KEEPTTL');
      return session;
    } catch (e) {
      this.logger.error(`Error during session update on: ${e}`);
      throw new InternalServerErrorException(`Error during session update on: ${e}`);
    }
  }
}
