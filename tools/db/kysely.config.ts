import { defineConfig } from 'kysely-ctl';
import { db } from './src/db.ts';

export default defineConfig({
  kysely: db,
  migrations: {
    migrationFolder: 'src/migrations',
  },
});
