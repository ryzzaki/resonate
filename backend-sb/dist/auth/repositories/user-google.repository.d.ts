import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserGoogleIdentity } from '../entities/user-google.entity';
export declare class UserGoogleRepository extends Repository<UserGoogleIdentity> {
    private logger;
    createGoogleIdentity(user: User, googleId: string): Promise<void>;
}
