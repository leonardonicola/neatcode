import { Logger, Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration, { type AppConfig, type LoggerConfig } from "./config";
import { GracefulShutdownModule } from "nestjs-graceful-shutdown";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
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
          },
        };
      },
    }),
    DatabaseModule,

    HealthModule,
  ],

  providers: [Logger],
})
export class AppModule {}
