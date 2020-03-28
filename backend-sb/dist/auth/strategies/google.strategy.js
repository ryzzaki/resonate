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
const passport_google_oauth20_1 = require("passport-google-oauth20");
const auth_service_1 = require("../auth.service");
const main_config_1 = require("../../config/main.config");
const urls_enum_1 = require("../enums/urls.enum");
const auth_enum_1 = require("../enums/auth.enum");
let GoogleStrategy = class GoogleStrategy extends passport_1.PassportStrategy(passport_google_oauth20_1.Strategy, 'google') {
    constructor(authService) {
        super({
            clientID: main_config_1.default.authProviderSettings.googleId,
            clientSecret: main_config_1.default.authProviderSettings.googleSecret,
            callbackURL: `${urls_enum_1.UrlEnums.AUTH_API_URL}/auth/google/callback`,
            profileFields: ['email', 'profileUrl', 'displayName'],
            scope: ['email'],
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        try {
            const userData = {
                id: profile.id.toString(),
                email: profile._json.email.toString(),
                displayName: this.getDisplayName(profile).toString(),
                source: auth_enum_1.AuthSourceEnums.GOOGLE,
            };
            const user = await this.authService.authenticateExternalSource(userData);
            done(null, user);
        }
        catch (error) {
            done(error, false);
        }
    }
    getDisplayName(profile) {
        if (profile.displayName) {
            return profile.displayName;
        }
        else {
            return profile._json.email.toString().split('@')[0];
        }
    }
};
GoogleStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], GoogleStrategy);
exports.GoogleStrategy = GoogleStrategy;
//# sourceMappingURL=google.strategy.js.map