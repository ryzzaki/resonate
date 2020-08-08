import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
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

    // Notify connected clients of current users
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
    // A client has connected
    this.users--;

    this.logger.verbose(`Current number of users: ${this.users}`);

    // Notify connected clients of current users
    this.server.emit('users', this.users);
    return;
  }

  @SubscribeMessage('rebroadcastSelectedURI')
  async onChat(@MessageBody() uris: string[]) {
    this.currentURI = uris;
    this.logger.verbose(`Newly selected URI: ${this.currentURI}`);
    this.server.emit('receiveSelectedURI', uris);
  }
}
