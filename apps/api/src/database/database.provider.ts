import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { AppConfig, DatabaseConfig } from "../config";

import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "kysely-codegen";

export const databaseProviders: Provider[] = [
  {
    provide: "KYSELY_CONNECTION",
    inject: [ConfigService],
    useFactory(appConfig: ConfigService<AppConfig>) {
      const isDev = appConfig.get<boolean>("isDev");
      const dbEnv = appConfig.get<DatabaseConfig>("database");

      const dialect = new PostgresDialect({
        pool: new Pool({
          connectionString: dbEnv?.url,
          max: dbEnv?.poolSize,
          ssl: !isDev,
        }),
      });

      const db = new Kysely<DB>({
        dialect,
      });
      return db;
    },
  },
];
