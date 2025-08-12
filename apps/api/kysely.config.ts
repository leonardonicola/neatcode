import { defineConfig } from "kysely-ctl";
import { db } from "./src/database/db";

export default defineConfig({
  kysely: db,
  migrations: {
    migrationFolder: "src/database/migrations",
  },
});
