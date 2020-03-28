"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const main_config_1 = require("./config/main.config");
const cors_config_1 = require("./config/cors.config");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    try {
        app.enableCors(cors_config_1.corsConfig);
        logger.log('CORS initialized');
        app.use(helmet());
        logger.log('Helmet initialized');
        app.use(cookieParser(main_config_1.default.serverSettings.cookieSecret));
        logger.log('Cookie Parser initialized with a secret');
        app.use('/v1/', rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 200,
        }));
        logger.log('Express Rate Limit initialized');
    }
    catch (error) {
        logger.error(`Failed to initialize all required middlewares on error ${error}`);
        throw new common_1.InternalServerErrorException(`Failed to initialize all required middlewares on error ${error}`);
    }
    await app.listen(main_config_1.default.serverSettings.port);
    logger.log(`Server listening on port: ${main_config_1.default.serverSettings.port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map