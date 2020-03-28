import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserFacebookIdentity } from '../entities/user-facebook.entity';
export declare class UserFacebookRepository extends Repository<UserFacebookIdentity> {
    private logger;
    createFacebookIdentity(user: User, facebookId: string): Promise<void>;
}
