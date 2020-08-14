import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  GatewayMetadata,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../auth/decorators/websocket.guard';

@WebSocketGateway(<GatewayMetadata>{ path: '/v1/webplayer', transports: ['websocket'] })
export class WebplayerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('WebplayerGateway');

  @WebSocketServer()
  private readonly server: Server;
  private users: number = 0;
  private currentURI: string[] | undefined = undefined;

  async handleConnection() {
    // A client has connected
    this.users++;

    this.logger.verbose(`Current number of users: ${this.users}`);

    // Play a default song if the state is fresh
    this.logger.verbose(
      `${this.currentURI ? `Initiating with current URI: ${this.currentURI}` : `No current URI found... playing default`}`
    );
    if (!this.currentURI) {
      this.currentURI = ['spotify:track:4Uy3kNxW2kB8AEoXljEcth'];
    }
    this.server.emit('receiveSelectedURI', this.currentURI);
    return;
  }

  async handleDisconnect() {
    // A client has disconnected
    this.users--;

    this.logger.verbose(`Current number of users: ${this.users}`);
    return;
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('rebroadcastSelectedURI')
  async onURIChange(@MessageBody() uris: string[]) {
    this.currentURI = uris;
    this.logger.verbose(`Newly selected URI: ${this.currentURI}`);
    this.server.emit('receiveSelectedURI', uris);
  }
}
