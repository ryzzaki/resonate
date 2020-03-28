import { BaseEntity } from 'typeorm';
import { User } from './user.entity';
export declare class UserGoogleIdentity extends BaseEntity {
    id: number;
    user: User;
    userId: number;
    googleId: string;
}
