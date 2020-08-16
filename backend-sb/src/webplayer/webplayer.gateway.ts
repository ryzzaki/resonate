import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  GatewayMetadata,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebplayerService } from './webplayer.service';
import { Logger, UseGuards, ForbiddenException } from '@nestjs/common';
import { WsAuthGuard } from '../auth/decorators/websocket.guard';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ExecCtxTypeEnum } from '../auth/interfaces/executionContext.enum';
import * as _ from 'lodash';

@WebSocketGateway(<GatewayMetadata>{ path: '/v1/webplayer', transports: ['websocket'] })
export class WebplayerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('WebplayerGateway');

  constructor(private readonly webplayerService: WebplayerService) {}

  @WebSocketServer()
  private readonly server: Server;
  private session: Session = {
    currentDJ: undefined,
    startsAt: Date.now(),
    currentURI: undefined,
    connectedUsers: [],
    webplayer: {
      isPlaying: true,
      songStartedAt: undefined,
      songPausedAt: undefined,
    },
  };

  async handleConnection(socket: Socket) {
    const jwtToken = <string>socket.handshake.query.token.replace('Bearer ', '');
    const user = _.omit(await this.webplayerService.getUserUsingJwtToken(jwtToken), [
      'email',
      'accessToken',
      'refreshToken',
      'subscription',
      'tokenVer',
    ]);

    if (!this.session.currentDJ && this.session.connectedUsers.length === 0) {
      this.session.currentDJ = user;
      this.session.startsAt = Date.now();
      this.session.endsAt = Date.now() + 10 * 60 * 1000;
    }

    if (
      !this.session.connectedUsers.find(val => {
        return val.id === user.id;
      })
    ) {
      this.session.connectedUsers.push(user);
    }

    this.logger.verbose(`A user has connected! Current number of users: ${this.session.connectedUsers.length}`);

    // Play a default song if the state is fresh
    this.logger.verbose(
      `${this.session.currentURI ? `Initiating with current URI: ${this.session.currentURI}` : `No current URI found... playing default`}`
    );

    if (!this.session.currentURI) {
      this.session.currentURI = ['spotify:track:4Uy3kNxW2kB8AEoXljEcth'];
      this.session.webplayer.songStartedAt = Date.now();
    }

    this.server.emit('receiveCurrentSession', this.session);
  }

  async handleDisconnect(socket: Socket) {
    const jwtToken = <string>socket.handshake.query.token.replace('Bearer ', '');
    const user = await this.webplayerService.getUserUsingJwtToken(jwtToken);
    this.session.connectedUsers = this.session.connectedUsers.filter(val => !(val.id === user.id));
    if (user.id === this.session.currentDJ.id) {
      if (this.session.connectedUsers.length !== 0) {
        await this.selectNewDJ(user);
      }
      this.session.currentDJ = undefined;
      this.server.emit('receiveNewDJ', this.session.currentDJ);
    }
    this.logger.verbose(`A user has disconnected! Current number of users: ${this.session.connectedUsers.length}`);
    this.server.emit('receiveCurrentSession', this.session);
    return socket.disconnect();
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getSession')
  async getSession() {
    this.server.emit('receiveCurrentSession', this.session);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getUsers')
  async getUsers() {
    this.server.emit('receiveUsers', this.session.connectedUsers);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getSongStart')
  async getSongStart() {
    this.server.emit('receiveCurrentSongStart', this.session.webplayer.songStartedAt);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getSongPause')
  async getSongPause() {
    this.server.emit('receiveCurrentSongPause', this.session.webplayer.songPausedAt);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('rebroadcastSelectedURI')
  async onURIChange(@MessageBody() uris: string[], @GetUser(ExecCtxTypeEnum.WEBSOCKET) user: User) {
    this.isPermittedForUser(user);
    this.session.currentURI = uris;
    this.session.webplayer.songStartedAt = Date.now();
    this.logger.verbose(`Newly selected URI: ${this.session.currentURI}`);
    this.server.emit('receiveCurrentURI', this.session.currentURI);
    this.server.emit('receiveCurrentSongStart', this.session.webplayer.songStartedAt);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('selectNewDJ')
  async selectNewDJ(@GetUser(ExecCtxTypeEnum.WEBSOCKET) user: User) {
    this.isPermittedForUser(user);
    this.session.currentDJ = _.sample(this.session.connectedUsers);
    this.session.startsAt = Date.now();
    this.server.emit('receiveNewDJ', this.session.currentDJ);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('updateWebplayerState')
  async setWebplayerState(@MessageBody() state: boolean, @GetUser(ExecCtxTypeEnum.WEBSOCKET) user: User) {
    this.isPermittedForUser(user);
    if (!state) {
      this.session.webplayer.songPausedAt = Date.now();
    }
    this.session.webplayer.isPlaying = state;
    this.server.emit('receiveCurrentWebplayerState', this.session.webplayer.isPlaying);
  }

  private isPermittedForUser(user: User) {
    if (user.id !== this.session.currentDJ.id) {
      throw new WsException(ForbiddenException);
    }
  }
}

interface Session {
  currentDJ: _.Omit<User, 'email' | 'accessToken' | 'refreshToken' | 'subscription' | 'tokenVer'> | undefined;
  currentURI: string[] | undefined;
  connectedUsers: _.Omit<User, 'email' | 'accessToken' | 'refreshToken' | 'subscription' | 'tokenVer'>[];
  startsAt: number;
  endsAt?: number;
  webplayer: {
    isPlaying: boolean;
    songStartedAt: number | undefined;
    songPausedAt: number | undefined;
  };
}
