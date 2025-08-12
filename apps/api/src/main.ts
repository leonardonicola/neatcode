import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";
import type { AppConfig } from "./config";
import { setupGracefulShutdown } from "nestjs-graceful-shutdown";
import { ValidationPipe } from "@nestjs/common";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import { DatabaseConfig, DatabaseEnv } from "./database/database.config";
import { Pool } from "pg";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService<AppConfig & DatabaseConfig>);
  const logger = app.get(Logger);
  const port = configService.get<number>("port") ?? 3000;
  const secret = configService.get<string>("secret");
  const isDev = configService.get<boolean>("isDev");
  const dbConfig = configService.get<DatabaseEnv>("database");

  app.useLogger(app.get(Logger));
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const PgSession = connectPgSimple(session);

  const sessionPool = new Pool({
    connectionString: dbConfig?.url,
    max: 5,
    idleTimeoutMillis: 2000,
    connectionTimeoutMillis: 1000,
  });

  app.use(
    session({
      store: new PgSession({
        pool: sessionPool,
        tableName: "session",
      }),
      secret: secret || "super-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: !isDev, // HTTPS in production
        sameSite: "lax",
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  setupGracefulShutdown({ app });

  await app.listen(port, () => {
    logger.log(`Application started at port:${port}`);
  });
}

bootstrap();
