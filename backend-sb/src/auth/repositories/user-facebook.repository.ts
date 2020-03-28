import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserFacebookIdentity } from '../entities/user-facebook.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(UserFacebookIdentity)
export class UserFacebookRepository extends Repository<UserFacebookIdentity> {
  private logger = new Logger('UserFacebookRepository');

  async createFacebookIdentity(user: User, facebookId: string): Promise<void> {
    const identities = await this.find({ where: [{ user, facebookId }] });
    if (identities.length !== 0) {
      return;
    }
    const facebookIdentity = new UserFacebookIdentity();
    facebookIdentity.user = user;
    facebookIdentity.facebookId = facebookId;
    try {
      await this.save(facebookIdentity);
    } catch (error) {
      this.logger.error(`Facebook Identity creation FAILED on error: ${error}`);
      throw new InternalServerErrorException(`Facebook Identity creation FAILED on error: ${error}`);
    }
    this.logger.verbose(`Facebook Identity CREATED for User ID: ${user.id}`);
  }
}
