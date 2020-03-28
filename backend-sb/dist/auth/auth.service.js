"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const uuid = require("uuid");
const main_config_1 = require("../config/main.config");
const cookie_config_1 = require("../config/cookie.config");
const typeorm_1 = require("@nestjs/typeorm");
const user_repository_1 = require("./repositories/user.repository");
const user_facebook_repository_1 = require("./repositories/user-facebook.repository");
const user_google_repository_1 = require("./repositories/user-google.repository");
const nestjs_redis_1 = require("nestjs-redis");
const jwt_1 = require("@nestjs/jwt");
const auth_enum_1 = require("./enums/auth.enum");
const urls_enum_1 = require("./enums/urls.enum");
let AuthService = class AuthService {
    constructor(userRepository, userFacebookRepository, userGoogleRepository, jwtService, redisService) {
        this.userRepository = userRepository;
        this.userFacebookRepository = userFacebookRepository;
        this.userGoogleRepository = userGoogleRepository;
        this.jwtService = jwtService;
        this.redisService = redisService;
        this.logger = new common_1.Logger('AuthService');
    }
    async signOutUser(req, res) {
        const existingToken = req.signedCookies.refresh_tkn_v1;
        if (!existingToken) {
            this.logger.log('Token not found in signed cookies');
            throw new common_1.BadRequestException('Token not found in signed cookies');
        }
        await this.blackListToken(existingToken);
        res
            .clearCookie('refresh_tkn_v1', {
            domain: cookie_config_1.cookieConfig.domain,
        })
            .redirect(String(urls_enum_1.UrlEnums.REDIRECT_URL));
    }
    async authenticateExternalSource(userData) {
        const { id, email, displayName, source } = userData;
        try {
            const user = await this.userRepository.externalAuthentication(email, displayName);
            source === auth_enum_1.AuthSourceEnums.FACEBOOK
                ? await this.userFacebookRepository.createFacebookIdentity(user, id)
                : await this.userGoogleRepository.createGoogleIdentity(user, id);
            return user;
        }
        catch (error) {
            this.logger.error(`Unable to authenticate from external source on error: ${error}`);
            throw new common_1.InternalServerErrorException(`Unable to authenticate from external source on error: ${error}`);
        }
    }
    async sendCredentials(req, res, user, source) {
        const existingToken = req.signedCookies.refresh_tkn_v1;
        if (existingToken) {
            res.clearCookie('refresh_tkn_v1', {
                domain: cookie_config_1.cookieConfig.domain,
            });
            throw new common_1.BadRequestException(`Client is already logged in with an active token`);
        }
        const refreshToken = await this.generateToken(user.id, auth_enum_1.AuthTypeEnums.REFRESH, user.tokenVer);
        const accessToken = await this.generateToken(user.id, auth_enum_1.AuthTypeEnums.ACCESS, null);
        if (source === auth_enum_1.AuthSourceEnums.LOCAL) {
            res
                .cookie('refresh_tkn_v1', refreshToken, cookie_config_1.cookieConfig)
                .status(200)
                .send({ accessToken });
        }
        else {
            res.cookie('refresh_tkn_v1', refreshToken, cookie_config_1.cookieConfig).redirect(`${urls_enum_1.UrlEnums.REDIRECT_URL}/auth/redirect?access_token=${accessToken}`);
        }
        return;
    }
    async refreshCredentials(req, res) {
        if (!req.signedCookies.refresh_tkn_v1) {
            this.logger.log('Access Denied: no Refresh Token found in cookies');
            throw new common_1.UnauthorizedException('Access Denied: no Refresh Token found in cookies');
        }
        const { id, ver } = await this.validateRefreshToken(req.signedCookies.refresh_tkn_v1);
        const refreshToken = await this.generateToken(id, auth_enum_1.AuthTypeEnums.REFRESH, ver);
        const accessToken = await this.generateToken(id, auth_enum_1.AuthTypeEnums.ACCESS, null);
        res
            .clearCookie('refresh_tkn_v1', {
            domain: cookie_config_1.cookieConfig.domain,
        })
            .cookie('refresh_tkn_v1', refreshToken, cookie_config_1.cookieConfig)
            .status(200)
            .send({ accessToken });
        return;
    }
    async updateUserDetails(updateDetailsDto, user) {
        const { displayName } = updateDetailsDto;
        await this.userRepository.updateUserDisplayNameById(user.id, displayName);
        return await this.userRepository.findUserById(user.id);
    }
    async getUserById(id) {
        return await this.userRepository.findUserById(id);
    }
    async getBasicUserById(id) {
        const { displayName } = await this.userRepository.findUserById(id);
        return { id, displayName };
    }
    async generateInvitationToken(groupId) {
        const payload = { groupId };
        const generatedToken = await this.jwtService.signAsync(payload, {
            expiresIn: '60m',
            jwtid: uuid.v4(),
        });
        return generatedToken;
    }
    async generateToken(id, type, ver) {
        const payload = { id, ver, type };
        const generatedToken = await this.jwtService.signAsync(payload, {
            expiresIn: type === auth_enum_1.AuthTypeEnums.REFRESH ? main_config_1.default.serverSettings.refreshTokenAge : '15m',
            jwtid: uuid.v4(),
        });
        return generatedToken;
    }
    async validateInvitationToken(invitationToken) {
        try {
            const { jti, groupId } = await this.jwtService.verifyAsync(invitationToken);
            const client = this.redisService.getClient();
            const token = await client.get(String(jti));
            if (token) {
                throw new common_1.BadRequestException('Token is invalid');
            }
            return { jti, groupId };
        }
        catch (err) {
            this.logger.error(`Invitation Token validation has failed on error: ${err}`);
            throw new common_1.UnauthorizedException(`Invitation Token validation has failed on error: ${err}`);
        }
    }
    async getAllUsersCount() {
        return await this.userRepository.getAllUsersCount();
    }
    async getAllUsersDetail() {
        return await this.userRepository.getAllUsersCount();
    }
    async blackListToken(blackListedToken) {
        const client = this.redisService.getClient();
        const { jti, exp } = this.jwtService.decode(blackListedToken);
        const expirationTime = Number(exp) - Date.now() / 1000;
        client.set(jti, blackListedToken, 'EX', Math.floor(expirationTime), (err, result) => {
            if (err) {
                this.logger.error('Redis Client Error: ' + err.message);
                throw new common_1.InternalServerErrorException('Redis Client Error: ' + err.message);
            }
            return;
        });
    }
    async validateRefreshToken(refreshJwtToken) {
        try {
            const { jti, id, ver } = await this.jwtService.verifyAsync(refreshJwtToken);
            const client = this.redisService.getClient();
            const token = await client.get(String(jti));
            if (token) {
                throw new common_1.BadRequestException('Token is invalid');
            }
            return { id, ver };
        }
        catch (err) {
            this.logger.error(`Refresh Token validation has failed on error: ${err}`);
            throw new common_1.UnauthorizedException(`Refresh Token validation has failed on error: ${err}`);
        }
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_repository_1.UserRepository)),
    __param(1, typeorm_1.InjectRepository(user_facebook_repository_1.UserFacebookRepository)),
    __param(2, typeorm_1.InjectRepository(user_google_repository_1.UserGoogleRepository)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        user_facebook_repository_1.UserFacebookRepository,
        user_google_repository_1.UserGoogleRepository,
        jwt_1.JwtService,
        nestjs_redis_1.RedisService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map