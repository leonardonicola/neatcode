import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("users")
    .ifNotExists()
    .addColumn("id", "uuid", (col) => col.primaryKey())
    .addColumn("password_hash", "varchar(255)")
    .addColumn("email", "varchar(255)", (c) => c.unique().notNull())
    .addColumn("first_name", "varchar(100)", (col) => col.notNull())
    .addColumn("last_name", "varchar(100)")
    .addColumn("provider_id", "varchar", (c) => c.unique())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("updated_at", "timestamp", (c) =>
      c.defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema
    .createIndex("idx_provider_id")
    .on("users")
    .column("provider_id")
    .execute();

  await sql`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql'`.execute(db);

  await sql`
    CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column()
  `.execute(db);

  await db.schema
    .createTable("session")
    .ifNotExists()
    .addColumn("sid", "varchar", (c) => c.notNull().primaryKey())
    .addColumn("sess", "json", (c) => c.notNull())
    .addColumn("expire", "timestamp(6)", (c) => c.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS update_users_updated_at ON users`.execute(
    db,
  );
  await sql`DROP FUNCTION IF EXISTS update_updated_at_column()`.execute(db);
  await db.schema.dropTable("session").ifExists().execute();
  await db.schema.dropTable("users").ifExists().execute();
}
