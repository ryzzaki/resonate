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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_facebook_1 = require("passport-facebook");
const auth_service_1 = require("../auth.service");
const main_config_1 = require("../../config/main.config");
const urls_enum_1 = require("../enums/urls.enum");
const auth_enum_1 = require("../enums/auth.enum");
let FacebookStrategy = class FacebookStrategy extends passport_1.PassportStrategy(passport_facebook_1.Strategy, 'facebook') {
    constructor(authService) {
        super({
            clientID: main_config_1.default.authProviderSettings.facebookId,
            clientSecret: main_config_1.default.authProviderSettings.facebookSecret,
            callbackURL: `${urls_enum_1.UrlEnums.AUTH_API_URL}/auth/facebook/callback`,
            profileFields: ['id', 'emails', 'displayName'],
            enableProof: true,
            scope: ['email'],
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        try {
            const userData = {
                id: profile._json.id.toString(),
                email: profile._json.email.toString(),
                displayName: profile._json.name.toString(),
                source: auth_enum_1.AuthSourceEnums.FACEBOOK,
            };
            const user = await this.authService.authenticateExternalSource(userData);
            done(null, user);
        }
        catch (error) {
            done(error, false);
        }
    }
};
FacebookStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], FacebookStrategy);
exports.FacebookStrategy = FacebookStrategy;
//# sourceMappingURL=facebook.strategy.js.map