import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";
import type { AppConfig } from "./config";
import { setupGracefulShutdown } from "nestjs-graceful-shutdown";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService<AppConfig>);
  const logger = app.get(Logger);
  const port = configService.get<number>("port") ?? 3000;

  app.useLogger(app.get(Logger));
  app.setGlobalPrefix("api");

  setupGracefulShutdown({ app });

  await app.listen(port, () => {
    logger.log(`Application started at port:${port}`);
  });
}

bootstrap();
