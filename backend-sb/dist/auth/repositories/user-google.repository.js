"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_google_entity_1 = require("../entities/user-google.entity");
const common_1 = require("@nestjs/common");
let UserGoogleRepository = class UserGoogleRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('UserGoogleRepository');
    }
    async createGoogleIdentity(user, googleId) {
        const identities = await this.find({ where: [{ user, googleId }] });
        if (identities.length !== 0) {
            return;
        }
        const googleIdentity = new user_google_entity_1.UserGoogleIdentity();
        googleIdentity.user = user;
        googleIdentity.googleId = googleId;
        try {
            await this.save(googleIdentity);
        }
        catch (error) {
            this.logger.error(`Google Identity creation FAILED on error: ${error}`);
            throw new common_1.InternalServerErrorException(`Google Identity creation FAILED on error: ${error}`);
        }
        this.logger.verbose(`Google Identity CREATED for User ID: ${user.id}`);
    }
};
UserGoogleRepository = __decorate([
    typeorm_1.EntityRepository(user_google_entity_1.UserGoogleIdentity)
], UserGoogleRepository);
exports.UserGoogleRepository = UserGoogleRepository;
//# sourceMappingURL=user-google.repository.js.map