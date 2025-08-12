import { SafeUser } from "./user";

export type SessionUser = Pick<
  SafeUser,
  "id" | "email" | "first_name" | "last_name"
>;
