import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from "@nestjs/common";
import * as Sentry from '@sentry/node';
import { RewriteFrames } from "@sentry/integrations";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    Sentry.init({
        dsn: "https://6f870327fc3d492689fedb8bdd9f9d53@o4504513377009664.ingest.sentry.io/4504513380220928",
        tracesSampleRate: 1.0,
        integrations: [
            new RewriteFrames({
                root: global.__dirname,
            }),
        ]
    });
  await app.listen(3060).then(() => {
      Logger.log(`Server is listening on ${3060}`);
  });
}
bootstrap();
