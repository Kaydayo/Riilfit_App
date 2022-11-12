import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestPayloadValidator } from './client/validators/request-payload.validator';
import config from './config/configuration';
import * as dotenv from "dotenv";

dotenv.config();

const logger: Logger = new Logger('Main');


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new RequestPayloadValidator());
  await app.listen(config().port, () => {
    logger.log('---------------------------------');
    logger.log(`🚀 App is listening on ${config().port} 🚀`);
    logger.log('---------------------------------');
  });
}
bootstrap();
