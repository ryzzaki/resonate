import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Logger, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private existingUser: User;
  private logger = new Logger('UserRepository');

  async externalAuthentication(
    email: string,
    userName: string,
    displayName: string,
    country: string,
    subscription: string,
    accessToken: string,
    refreshToken: string
  ): Promise<User> {
    if (await this.isAnExistingUser(email)) {
      return this.existingUser;
    }
    return await this.createUser(email, userName, displayName, country, subscription, accessToken, refreshToken);
  }

  async getUserByIdToken(id: number, tokenVer: number): Promise<User> {
    try {
      return await this.findOneOrFail({ where: { id, tokenVer } });
    } catch (error) {
      this.logger.log(`Failed to find user given ID: ${id} and tokenVer: ${tokenVer}`);
      throw new UnauthorizedException(`Failed to find user given ID: ${id} and tokenVer: ${tokenVer}`);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      return await this.findOneOrFail({ where: { id } });
    } catch (error) {
      this.logger.log(`Failed to find user given id: ${id}`);
      throw new UnauthorizedException(`Failed to find user given id: ${id}`);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      return await this.findOneOrFail({ where: { email } });
    } catch (error) {
      this.logger.log(`Failed to find user given email: ${email}`);
      throw new UnauthorizedException(`Failed to find user given email: ${email}`);
    }
  }

  async updateUserDisplayNameById(id: string, displayName: string): Promise<void> {
    try {
      await this.update({ id }, { displayName });
    } catch (error) {
      this.logger.error(`Failed to update user display name for: ${id} on error: ${error}`);
      throw new InternalServerErrorException('Failed to update user display name for: ${id} on error: ${error}');
    }
  }

  async updateUserSpotifyTokensById(id: string, accessToken: string, refreshToken: string): Promise<void> {
    try {
      await this.update({ id }, { accessToken, refreshToken });
    } catch (error) {
      this.logger.error(`Failed to update user refreshToken for: ${id} on error: ${error}`);
      throw new InternalServerErrorException('Failed to update user refreshToken for: ${id} on error: ${error}');
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

  private async createUser(
    email: string,
    userName: string,
    displayName: string,
    country: string,
    subscription: string,
    accessToken: string,
    refreshToken: string
  ): Promise<User> {
    const u = new User();
    u.email = email;
    u.userName = userName;
    u.displayName = displayName;
    u.country = country;
    u.subscription = subscription;
    u.accessToken = accessToken;
    u.refreshToken = refreshToken;
    u.tokenVer = 1;
    try {
      await this.save(u);
    } catch (error) {
      this.logger.error(`User Entity creation FAILED on error: ${error}`);
      throw new InternalServerErrorException(`User Entity creation FAILED on error: ${error}`);
    }
    return u;
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
