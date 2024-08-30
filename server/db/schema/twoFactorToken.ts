import {
  pgTable,
  text,
  primaryKey,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const twoFactorToken = pgTable(
  "two_factor_token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);
