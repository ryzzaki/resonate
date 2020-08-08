import { createParamDecorator } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator((data, req): User | undefined => {
  return req.args[0].user as User;
});
