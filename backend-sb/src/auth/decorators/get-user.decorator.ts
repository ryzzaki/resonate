import { createParamDecorator } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { ExecCtxTypeEnum } from '../interfaces/executionContext.enum';

export const GetUser = createParamDecorator(
  (executionContextType: ExecCtxTypeEnum, ctx): User => {
    if (executionContextType === ExecCtxTypeEnum.WEBSOCKET) {
      return ctx.switchToHttp().getRequest().client.request.user;
    }
    return ctx.args[0].user as User;
  }
);
