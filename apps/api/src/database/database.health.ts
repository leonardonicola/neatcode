import { Inject, Injectable, Logger } from "@nestjs/common";
import { HealthIndicatorService } from "@nestjs/terminus";
import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";

const KEY = "database";

@Injectable()
export class DatabaseHealthIndicator {
  private readonly logger = new Logger(DatabaseHealthIndicator.name);

  constructor(
    @Inject("KYSELY_CONNECTION") private readonly db: Kysely<DB>,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy() {
    const indicator = this.healthIndicatorService.check(KEY);
    try {
      await sql`select 1+1 AS result`.execute(this.db);
      return indicator.up();
    } catch (error) {
      this.logger.error(error, "Database connection failed");
      return indicator.down({
        status: "down",
        message: "Database connection failed",
      });
    }
  }
}
