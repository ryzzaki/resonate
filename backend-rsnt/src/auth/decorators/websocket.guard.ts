import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): Request {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.query.token;
    const request = context.switchToHttp().getRequest().client.request as Request;
    request.headers.authorization = token;
    return request;
  }
}
