import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  GatewayMetadata,
  WsException,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebplayerService } from './webplayer.service';
import { Logger, UseGuards, ForbiddenException } from '@nestjs/common';
import { SessionService } from '../session/session.service';
import { User } from '../auth/entities/user.entity';
import { WsAuthGuard } from '../auth/decorators/websocket.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ExecCtxTypeEnum } from '../auth/interfaces/executionContext.enum';
import { Session } from '../session/interfaces/session.interface';
import axios from 'axios';
import * as _ from 'lodash';
import { SpotifyService } from '../spotify/spotify.service';

@WebSocketGateway(<GatewayMetadata>{ path: '/v1/webplayer', transports: ['websocket'] })
export class WebplayerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('WebplayerGateway');

  constructor(
    private readonly webplayerService: WebplayerService,
    private readonly sessionService: SessionService,
    private readonly spotifyService: SpotifyService
  ) {}

  @WebSocketServer()
  private readonly server: Server;

  async handleConnection(socket: Socket) {
    const jwtToken = <string>socket.handshake.query.token.replace('Bearer ', '');
    const session = await this.getSessionFromSocketQueryId(socket);
    // IMPORTANT: join the correct room uuid
    socket.join(session.id);
    const user = _.omit(await this.webplayerService.getUserUsingJwtToken(jwtToken), [
      'email',
      'accessToken',
      'refreshToken',
      'subscription',
      'tokenVer',
    ]);
    if (!session.currentDJ && session.connectedUsers.length === 0) {
      session.currentDJ = user;
      session.startsAt = Date.now();
      session.endsAt = Date.now() + 10 * 60 * 1000;
      session.webplayer.songStartedAt = Date.now();
    }
    session.connectedUsers.push(user);
    this.logger.verbose(`A user has connected! Current number of users: ${session.connectedUsers.length}`);
    this.server.to(socket.id).emit('receiveCurrentSession', session);
    this.server.to(session.id).emit('receiveUsers', session.connectedUsers);
    await this.sessionService.updateSession(session);
  }

  async handleDisconnect(socket: Socket) {
    const jwtToken = <string>socket.handshake.query.token.replace('Bearer ', '');
    const session = await this.getSessionFromSocketQueryId(socket);
    const user = await this.webplayerService.getUserUsingJwtToken(jwtToken);
    session.connectedUsers = session.connectedUsers.filter((val) => val.id !== user.id);
    if (user.id === session.currentDJ.id) {
      if (session.connectedUsers.length > 0) {
        session.currentDJ = _.sample(session.connectedUsers);
        session.startsAt = Date.now();
        this.server.to(session.id).emit('receiveNewDJ', session.currentDJ);
      } else {
        session.currentDJ = null;
      }
    }
    this.logger.verbose(`A user has disconnected! Current number of users: ${session.connectedUsers.length}`);
    await this.sessionService.updateSession(session);
    // gracefully exit the room
    socket.leave(session.id);
    socket.disconnect();
    return this.server.to(session.id).emit('receiveUsers', session.connectedUsers);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getSession')
  async getSession(@ConnectedSocket() socket: Socket) {
    const session = await this.getSessionFromSocketQueryId(socket);
    this.server.to(session.id).emit('receiveCurrentSession', session);
    await this.sessionService.updateSession(session);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getUsers')
  async getUsers(@ConnectedSocket() socket: Socket) {
    const session = await this.getSessionFromSocketQueryId(socket);
    this.server.to(session.id).emit('receiveUsers', session.connectedUsers);
    await this.sessionService.updateSession(session);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('getSongStart')
  async getSongStart(@ConnectedSocket() socket: Socket) {
    const session = await this.getSessionFromSocketQueryId(socket);
    this.server.to(session.id).emit('receiveCurrentSongStart', session.webplayer.songStartedAt);
    await this.sessionService.updateSession(session);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('rebroadcastSelectedURI')
  async onURIChange(@MessageBody() uri: string, @GetUser(ExecCtxTypeEnum.WEBSOCKET) user: User, @ConnectedSocket() socket: Socket) {
    const session = await this.getSessionFromSocketQueryId(socket);
    this.isPermittedForUser(user, session);
    if (uri.includes('spotify:album:')) {
      const { data } = await this.spotifyService.getAlbumTracks(user, uri);
      session.currentURI = data.items.map((track: { uri: string }) => track.uri);
    } else {
      session.currentURI = [uri];
    }
    session.webplayer.songStartedAt = Date.now();
    this.logger.verbose(`Newly selected URI: ${session.currentURI}`);
    this.server.to(session.id).emit('receiveCurrentSession', session);
    await this.sessionService.updateSession(session);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('rebroadcastSongStartedAt')
  async onSongStartChange(
    @MessageBody() songStartedAt: number,
    @GetUser(ExecCtxTypeEnum.WEBSOCKET) user: User,
    @ConnectedSocket() socket: Socket
  ) {
    const session = await this.getSessionFromSocketQueryId(socket);
    this.isPermittedForUser(user, session);
    session.webplayer.songStartedAt = songStartedAt;
    this.logger.verbose(`SongStartedAt changed: ${session.webplayer.songStartedAt}`);
    this.server.to(session.id).emit('receiveCurrentSongStart', session.webplayer.songStartedAt);
    await this.sessionService.updateSession(session);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('selectNewDJ')
  async selectNewDJ(@GetUser(ExecCtxTypeEnum.WEBSOCKET) user: User, @ConnectedSocket() socket: Socket) {
    const session = await this.getSessionFromSocketQueryId(socket);
    this.isPermittedForUser(user, session);
    const connectedUsersWithoutDJ = session.connectedUsers.filter((val) => val.id !== user.id);
    session.currentDJ = _.sample(connectedUsersWithoutDJ);
    session.startsAt = Date.now();
    this.server.to(session.id).emit('receiveNewDJ', session.currentDJ);
    await this.sessionService.updateSession(session);
  }

  async getSessionFromSocketQueryId(socket: Socket): Promise<Session> {
    const id = <string>socket.handshake.query.sessionId;
    return await this.sessionService.getSessionById(id);
  }

  private isPermittedForUser(user: User, session: Session) {
    if (user.id !== session.currentDJ.id) {
      throw new WsException(ForbiddenException);
    }
  }
}
