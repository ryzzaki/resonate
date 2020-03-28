import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { Request, Response } from 'express';
import { UpdateUserDto } from './dto/update.dto';
export declare class AuthController {
    private readonly authService;
    private logger;
    constructor(authService: AuthService);
    authenticateFacebook(): Promise<void>;
    facebookCallBack(req: Request, res: Response, user: User): Promise<void>;
    authenticateGoogle(): Promise<void>;
    googleCallBack(req: Request, res: Response, user: User): Promise<void>;
    signOutUser(req: Request, res: Response): Promise<void>;
    refreshCredentials(req: Request, res: Response): Promise<void>;
    updateUserDetails(updateDetailsDto: UpdateUserDto, user: User): Promise<User>;
    getBasicUserById(userId: number): Promise<{
        id: number;
        displayName: string;
    }>;
    getPrivateUserById(user: User): Promise<User>;
}
