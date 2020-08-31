import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import mainConfig from './config/main.config';
import { corsConfig } from './config/cors.config';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  try {
    app.enableCors(corsConfig);
    logger.log('CORS initialized');

    app.use(helmet());
    logger.log('Helmet initialized');

    app.use(cookieParser(mainConfig.serverSettings.cookieSecret));
    logger.log('Cookie Parser initialized with a secret');

    app.use(
      '/v1/',
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // limit each IP to 1000 requests per windowMs
      })
    );
    logger.log('Express Rate Limit initialized');
  } catch (error) {
    logger.error(`Failed to initialize all required middlewares on error ${error}`);
    throw new InternalServerErrorException(`Failed to initialize all required middlewares on error ${error}`);
  }

  await app.listen(mainConfig.serverSettings.port);
  logger.log(`Server listening on port: ${mainConfig.serverSettings.port}`);
}
bootstrap();
