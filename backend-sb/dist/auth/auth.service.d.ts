import { Request, Response } from 'express';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserFacebookRepository } from './repositories/user-facebook.repository';
import { UserGoogleRepository } from './repositories/user-google.repository';
import { RedisService } from 'nestjs-redis';
import { JwtService } from '@nestjs/jwt';
import { UserDataInterface } from '../interfaces/user-data.interface';
import { UpdateUserDto } from './dto/update.dto';
import { AuthSourceEnums } from './enums/auth.enum';
export declare class AuthService {
    private readonly userRepository;
    private readonly userFacebookRepository;
    private readonly userGoogleRepository;
    private readonly jwtService;
    private readonly redisService;
    private logger;
    constructor(userRepository: UserRepository, userFacebookRepository: UserFacebookRepository, userGoogleRepository: UserGoogleRepository, jwtService: JwtService, redisService: RedisService);
    signOutUser(req: Request, res: Response): Promise<void>;
    authenticateExternalSource(userData: UserDataInterface): Promise<User>;
    sendCredentials(req: Request, res: Response, user: User, source: AuthSourceEnums): Promise<void>;
    refreshCredentials(req: Request, res: Response): Promise<void>;
    updateUserDetails(updateDetailsDto: UpdateUserDto, user: User): Promise<User>;
    getUserById(id: number): Promise<User>;
    getBasicUserById(id: number): Promise<{
        id: number;
        displayName: string;
    }>;
    generateInvitationToken(groupId: number): Promise<string>;
    private generateToken;
    validateInvitationToken(invitationToken: string): Promise<{
        jti: string;
        groupId: number;
    }>;
    getAllUsersCount(): Promise<{
        total: number;
    }>;
    getAllUsersDetail(): Promise<{
        total: number;
        users: User[];
    }>;
    private blackListToken;
    private validateRefreshToken;
}
