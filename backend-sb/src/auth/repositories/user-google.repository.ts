import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserGoogleIdentity } from '../entities/user-google.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(UserGoogleIdentity)
export class UserGoogleRepository extends Repository<UserGoogleIdentity> {
  private logger = new Logger('UserGoogleRepository');

  async createGoogleIdentity(user: User, googleId: string) {
    const identities = await this.find({ where: [{ user, googleId }] });
    if (identities.length !== 0) {
      return;
    }
    const googleIdentity = new UserGoogleIdentity();
    googleIdentity.user = user;
    googleIdentity.googleId = googleId;
    try {
      await this.save(googleIdentity);
    } catch (error) {
      this.logger.error(`Google Identity creation FAILED on error: ${error}`);
      throw new InternalServerErrorException(`Google Identity creation FAILED on error: ${error}`);
    }
    this.logger.verbose(`Google Identity CREATED for User ID: ${user.id}`);
  }
}
