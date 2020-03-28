import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Logger, InternalServerErrorException, UnauthorizedException, ConflictException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private existingUser: User;
  private logger = new Logger('UserRepository');

  async externalAuthentication(email: string, displayName: string): Promise<User> {
    if (await this.isAnExistingUser(email)) {
      return this.existingUser;
    }
    return await this.createUser(email, displayName);
  }

  async findUserByIdToken(id: number, tokenVer: number): Promise<User> {
    try {
      return await this.findOneOrFail({ where: { id, tokenVer } });
    } catch (error) {
      this.logger.log(`Failed to find user given ID: ${id} and tokenVer: ${tokenVer}`);
      throw new UnauthorizedException(`Failed to find user ${id}`);
    }
  }

  async findUserById(id: number): Promise<User> {
    try {
      return await this.findOneOrFail({ where: { id } });
    } catch (error) {
      this.logger.log(`Failed to find user given id: ${id}`);
      throw new UnauthorizedException(`Failed to find user ${id}`);
    }
  }

  async updateUserDisplayNameById(id: number, displayName: string): Promise<void> {
    try {
      await this.update(id, { displayName });
    } catch (error) {
      this.logger.error(`Failed to update user display name for: ${id} on error: ${error}`);
      throw new InternalServerErrorException('Failed to update user display name');
    }
  }

  async getAllUsersCount(): Promise<{ total: number; users: User[] }> {
    try {
      const [users, total] = await this.findAndCount();
      return { total, users };
    } catch (error) {
      this.logger.log(`Failed to fetch all the users`);
      throw new InternalServerErrorException(`Failed to fetch all the users`);
    }
  }

  private async createUser(email: string, displayName: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.displayName = displayName;
    user.tokenVer = 1;
    try {
      await this.save(user);
    } catch (error) {
      this.logger.error(`User Entity creation FAILED on error: ${error}`);
      throw new InternalServerErrorException(`User Entity creation FAILED on error: ${error}`);
    }
    return user;
  }

  private async isAnExistingUser(email: string): Promise<boolean> {
    const user = await this.findOne({ where: { email } });
    if (user == null) {
      return false;
    }
    this.existingUser = user;
    return true;
  }
}
