"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_facebook_entity_1 = require("../entities/user-facebook.entity");
const common_1 = require("@nestjs/common");
let UserFacebookRepository = class UserFacebookRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('UserFacebookRepository');
    }
    async createFacebookIdentity(user, facebookId) {
        const identities = await this.find({ where: [{ user, facebookId }] });
        if (identities.length !== 0) {
            return;
        }
        const facebookIdentity = new user_facebook_entity_1.UserFacebookIdentity();
        facebookIdentity.user = user;
        facebookIdentity.facebookId = facebookId;
        try {
            await this.save(facebookIdentity);
        }
        catch (error) {
            this.logger.error(`Facebook Identity creation FAILED on error: ${error}`);
            throw new common_1.InternalServerErrorException(`Facebook Identity creation FAILED on error: ${error}`);
        }
        this.logger.verbose(`Facebook Identity CREATED for User ID: ${user.id}`);
    }
};
UserFacebookRepository = __decorate([
    typeorm_1.EntityRepository(user_facebook_entity_1.UserFacebookIdentity)
], UserFacebookRepository);
exports.UserFacebookRepository = UserFacebookRepository;
//# sourceMappingURL=user-facebook.repository.js.map