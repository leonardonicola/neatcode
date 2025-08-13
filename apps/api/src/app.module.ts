import { Logger, Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";
import { HealthModule } from "./modules/health/health.module";
import { rootConfig, type AppConfig, type LoggerConfig } from "./config/app";
import { APP_GUARD } from "@nestjs/core";
import { GlobalAuthGuard } from "./modules/auth/guards/global.guard";
import { AuthModule } from "./modules/auth/auth.module";
import { dbConfig } from "./config/database";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [rootConfig, dbConfig],
      isGlobal: true,
    }),
    GracefulShutdownModule.forRoot(),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService<AppConfig>) {
        const isDev = config.get<boolean>("isDev");
        const loggerConfig = config.get<LoggerConfig>("logger");

        return {
          pinoHttp: {
            level: loggerConfig?.level,
            transport: isDev ? { target: "pino-pretty" } : undefined,
            autoLogging: false,
            formatters: {
              level: (label: string) => {
                return { level: label };
              },
            },
            quietReqLogger: true,
          },
        };
      },
    }),
    DatabaseModule,

    AuthModule,
    HealthModule,
  ],

  providers: [
    Logger,
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule {}
