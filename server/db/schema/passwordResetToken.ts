import {
  pgTable,
  text,
  primaryKey,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const passwordResetToken = pgTable(
  "password_reset_token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
  })
);
