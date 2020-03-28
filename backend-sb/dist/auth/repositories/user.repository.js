"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const common_1 = require("@nestjs/common");
let UserRepository = class UserRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('UserRepository');
    }
    async externalAuthentication(email, displayName) {
        if (await this.isAnExistingUser(email)) {
            return this.existingUser;
        }
        return await this.createUser(email, displayName);
    }
    async findUserByIdToken(id, tokenVer) {
        try {
            return await this.findOneOrFail({ where: { id, tokenVer } });
        }
        catch (error) {
            this.logger.log(`Failed to find user given ID: ${id} and tokenVer: ${tokenVer}`);
            throw new common_1.UnauthorizedException(`Failed to find user ${id}`);
        }
    }
    async findUserById(id) {
        try {
            return await this.findOneOrFail({ where: { id } });
        }
        catch (error) {
            this.logger.log(`Failed to find user given id: ${id}`);
            throw new common_1.UnauthorizedException(`Failed to find user ${id}`);
        }
    }
    async updateUserDisplayNameById(id, displayName) {
        try {
            await this.update(id, { displayName });
        }
        catch (error) {
            this.logger.error(`Failed to update user display name for: ${id} on error: ${error}`);
            throw new common_1.InternalServerErrorException('Failed to update user display name');
        }
    }
    async getAllUsersCount() {
        try {
            const [users, total] = await this.findAndCount();
            return { total, users };
        }
        catch (error) {
            this.logger.log(`Failed to fetch all the users`);
            throw new common_1.InternalServerErrorException(`Failed to fetch all the users`);
        }
    }
    async createUser(email, displayName) {
        const user = new user_entity_1.User();
        user.email = email;
        user.displayName = displayName;
        user.tokenVer = 1;
        try {
            await this.save(user);
        }
        catch (error) {
            this.logger.error(`User Entity creation FAILED on error: ${error}`);
            throw new common_1.InternalServerErrorException(`User Entity creation FAILED on error: ${error}`);
        }
        return user;
    }
    async isAnExistingUser(email) {
        const user = await this.findOne({ where: { email } });
        if (user == null) {
            return false;
        }
        this.existingUser = user;
        return true;
    }
};
UserRepository = __decorate([
    typeorm_1.EntityRepository(user_entity_1.User)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map