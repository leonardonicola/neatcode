import { Insertable, Selectable } from "kysely";
import { DB } from "kysely-codegen";

export type User = Selectable<DB["users"]>;
export type SafeUser = Omit<User, "password_hash">;
export type NewUser = Insertable<User>;
