import { SafeUser } from "./user";

export type SessionUser = Pick<
  SafeUser,
  "id" | "email" | "first_name" | "last_name"
>;

export interface OAuth2User {
  id: string;
  displayName: string;
  emails: Array<{
    value: string;
    verified: boolean;
  }>;
  photos: Array<{
    value: string;
  }>;
  provider: string;
}
