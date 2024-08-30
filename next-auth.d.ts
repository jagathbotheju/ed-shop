import { User } from "./server/db/schema/user";
import { type DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultUser & User;
    isOAuth: boolean;
    test: string;
  }
}
