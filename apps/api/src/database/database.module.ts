import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { databaseProviders } from "./database.provider";
import { TerminusModule } from "@nestjs/terminus";
import { DatabaseHealthIndicator } from "./database.health";

@Global()
@Module({
  imports: [ConfigModule, TerminusModule],
  providers: [...databaseProviders, DatabaseHealthIndicator],
  exports: [...databaseProviders, DatabaseHealthIndicator],
})
export class DatabaseModule {}
