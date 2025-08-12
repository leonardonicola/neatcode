import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "./health.controller";

@Module({
  imports: [DatabaseModule, TerminusModule],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
