import {
  pgTable,
  text,
  primaryKey,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const emailToken = pgTable(
  "email_token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.id, verificationToken.token],
    }),
  })
);
