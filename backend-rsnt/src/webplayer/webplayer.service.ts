import { Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class WebplayerService {
  constructor(private readonly authService: AuthService) {}

  async getUserUsingJwtToken(token: string): Promise<User> {
    const userId = (await this.authService.decodeTokenPayload(token)).id;
    return this.authService.getUserById(userId);
  }
}
