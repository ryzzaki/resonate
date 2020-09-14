import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { CreateSessionDto } from './dto/createSession.dto';
import { Session, UriMetadata } from './interfaces/session.interface';
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

  private readonly defaultSongURIs: UriMetadata[] = [
    {
      uri: 'spotify:track:7qEKqBCD2vE5vIBsrUitpD',
      title: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?',
      artists: [
        {
          external_urls: {
            spotify: 'https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH',
          },
          href: 'https://api.spotify.com/v1/artists/6qqNVTkY8uBg9cP3Jd7DAH',
          id: '6qqNVTkY8uBg9cP3Jd7DAH',
          name: 'Billie Eilish',
          type: 'artist',
          uri: 'spotify:artist:6qqNVTkY8uBg9cP3Jd7DAH',
        },
      ],
      cover: 'https://i.scdn.co/image/ab67616d0000485150a3147b4edd7701a876c6ce',
    },
    {
      uri: 'spotify:track:6VrLYoQKdhu1Jruei06t65',
      title: 'Meet The Vamps',
      artists: [
        {
          external_urls: {
            spotify: 'https://open.spotify.com/artist/7gAppWoH7pcYmphCVTXkzs',
          },
          href: 'https://api.spotify.com/v1/artists/7gAppWoH7pcYmphCVTXkzs',
          id: '7gAppWoH7pcYmphCVTXkzs',
          name: 'The Vamps',
          type: 'artist',
          uri: 'spotify:artist:7gAppWoH7pcYmphCVTXkzs',
        },
      ],
      cover: 'https://i.scdn.co/image/ab67616d000048519f89b8390933e9ccb3673c89',
    },
    {
      uri: 'spotify:track:6VrLYoQKdhu1Jruei06t65',
      title: 'Woodstock',
      artists: [
        {
          external_urls: {
            spotify: 'https://open.spotify.com/artist/4kI8Ie27vjvonwaB2ePh8T',
          },
          href: 'https://api.spotify.com/v1/artists/4kI8Ie27vjvonwaB2ePh8T',
          id: '4kI8Ie27vjvonwaB2ePh8T',
          name: 'Portugal. The Man',
          type: 'artist',
          uri: 'spotify:artist:4kI8Ie27vjvonwaB2ePh8T',
        },
      ],
      cover: 'https://i.scdn.co/image/ab67616d00004851af52c228c9619ff6298b08cd',
    },
    {
      uri: 'spotify:track:2GiJYvgVaD2HtM8GqD9EgQ',
      title: 'Dopamine',
      artists: [
        {
          external_urls: {
            spotify: 'https://open.spotify.com/artist/1KP6TWI40m7p3QBTU6u2xo',
          },
          href: 'https://api.spotify.com/v1/artists/1KP6TWI40m7p3QBTU6u2xo',
          id: '1KP6TWI40m7p3QBTU6u2xo',
          name: 'BØRNS',
          type: 'artist',
          uri: 'spotify:artist:1KP6TWI40m7p3QBTU6u2xo',
        },
      ],
      cover: 'https://i.scdn.co/image/ab67616d00004851cc2cf912462d8ae4ef856434',
    },
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
      this.logger.error(`Error during session fetching on: ${e}`);
      throw new InternalServerErrorException(`Error during session fetching on: ${e}`);
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
