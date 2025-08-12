import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "kysely-codegen";

const dialect = new PostgresDialect({
  pool: new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT ?? "5432"),
    max: 10,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
