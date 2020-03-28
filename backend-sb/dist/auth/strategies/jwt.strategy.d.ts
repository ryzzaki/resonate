import { TokenPayloadInterface } from '../../interfaces/token-payload.interface';
import { UserRepository } from '../repositories/user.repository';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    validate(jwt: TokenPayloadInterface, done: (err: any, result: any) => void): Promise<void>;
}
export {};
