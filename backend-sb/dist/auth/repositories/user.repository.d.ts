import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UserRepository extends Repository<User> {
    private existingUser;
    private logger;
    externalAuthentication(email: string, displayName: string): Promise<User>;
    findUserByIdToken(id: number, tokenVer: number): Promise<User>;
    findUserById(id: number): Promise<User>;
    updateUserDisplayNameById(id: number, displayName: string): Promise<void>;
    getAllUsersCount(): Promise<{
        total: number;
        users: User[];
    }>;
    private createUser;
    private isAnExistingUser;
}
