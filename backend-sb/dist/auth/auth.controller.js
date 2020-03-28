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
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("./decorators/get-user.decorator");
const user_entity_1 = require("./entities/user.entity");
const auth_enum_1 = require("./enums/auth.enum");
const update_dto_1 = require("./dto/update.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.logger = new common_1.Logger('AuthController');
    }
    authenticateFacebook() {
        return;
    }
    facebookCallBack(req, res, user) {
        this.logger.verbose('GET on /facebook/callback called');
        return this.authService.sendCredentials(req, res, user, auth_enum_1.AuthSourceEnums.FACEBOOK);
    }
    authenticateGoogle() {
        return;
    }
    googleCallBack(req, res, user) {
        this.logger.verbose('GET on /google/callback called');
        return this.authService.sendCredentials(req, res, user, auth_enum_1.AuthSourceEnums.GOOGLE);
    }
    signOutUser(req, res) {
        this.logger.verbose('GET on /signout called');
        return this.authService.signOutUser(req, res);
    }
    refreshCredentials(req, res) {
        this.logger.verbose('GET on /user/refresh called');
        return this.authService.refreshCredentials(req, res);
    }
    updateUserDetails(updateDetailsDto, user) {
        this.logger.verbose('GET on /user/total/detail called');
        return this.authService.updateUserDetails(updateDetailsDto, user);
    }
    getBasicUserById(userId) {
        this.logger.verbose(`GET on /public/user/${userId} called`);
        return this.authService.getBasicUserById(userId);
    }
    getPrivateUserById(user) {
        this.logger.verbose(`GET on /private/user called`);
        return this.authService.getUserById(user.id);
    }
};
__decorate([
    common_1.Get('/facebook'),
    common_1.UseGuards(passport_1.AuthGuard('facebook')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticateFacebook", null);
__decorate([
    common_1.Get('/facebook/callback'),
    common_1.UseGuards(passport_1.AuthGuard('facebook')),
    __param(0, common_1.Req()), __param(1, common_1.Res()), __param(2, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "facebookCallBack", null);
__decorate([
    common_1.Get('/google'),
    common_1.UseGuards(passport_1.AuthGuard('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticateGoogle", null);
__decorate([
    common_1.Get('/google/callback'),
    common_1.UseGuards(passport_1.AuthGuard('google')),
    __param(0, common_1.Req()), __param(1, common_1.Res()), __param(2, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallBack", null);
__decorate([
    common_1.Get('/signout'),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signOutUser", null);
__decorate([
    common_1.Get('/user/refresh'),
    __param(0, common_1.Req()), __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshCredentials", null);
__decorate([
    common_1.Put('/user/update'),
    common_1.UseGuards(passport_1.AuthGuard()),
    __param(0, common_1.Body(common_1.ValidationPipe)), __param(1, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_dto_1.UpdateUserDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateUserDetails", null);
__decorate([
    common_1.Get('/public/user/:userId'),
    __param(0, common_1.Param('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getBasicUserById", null);
__decorate([
    common_1.Get('/private/user/'),
    common_1.UseGuards(passport_1.AuthGuard()),
    __param(0, get_user_decorator_1.GetUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getPrivateUserById", null);
AuthController = __decorate([
    common_1.Controller('/v1/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map