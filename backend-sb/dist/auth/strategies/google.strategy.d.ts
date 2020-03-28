import { AuthService } from '../auth.service';
declare const GoogleStrategy_base: new (...args: any[]) => any;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: (err: any, result: any) => void): Promise<void>;
    private getDisplayName;
}
export {};
