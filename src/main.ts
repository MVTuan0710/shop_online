import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3060).then(() => {
      Logger.log(`Server is listening on ${3060}`);
  });
}
bootstrap();
