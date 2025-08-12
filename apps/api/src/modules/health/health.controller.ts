import { Controller, Get } from "@nestjs/common";
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";
import { DatabaseHealthIndicator } from "../../database/database.health";
import { Public } from "../auth/decorator";

@Controller("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: DatabaseHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([() => this.db.isHealthy()]);
  }
}
