import { BaseEntity } from 'typeorm';
import { User } from './user.entity';
export declare class UserFacebookIdentity extends BaseEntity {
    id: number;
    user: User;
    userId: number;
    facebookId: string;
}
