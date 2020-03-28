import { AuthService } from '../auth.service';
declare const FacebookStrategy_base: new (...args: any[]) => any;
export declare class FacebookStrategy extends FacebookStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: (err: any, result: any) => void): Promise<void>;
}
export {};
