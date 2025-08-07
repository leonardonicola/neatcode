import { Global, Module } from '@nestjs/common';
import { Kysely } from 'kysely';
import type { DB } from 'kysely-codegen';
import { db } from '@neatcode/db';

export class Database extends Kysely<DB> {}

@Global()
@Module({
  exports: [Database],
  providers: [
    {
      provide: Database,
      useFactory: () => {
        return db;
      },
    },
  ],
})
export class DatabaseModule {}
