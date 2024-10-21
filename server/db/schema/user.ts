import { InferSelectModel, relations } from "drizzle-orm";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { reviews } from "./reviews";

// export const roleEnum = pgEnum("roles", ["user", "admin"]);

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  password: text("password"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  // role: roleEnum("roles").default("user"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const useRelations = relations(user, ({ many }) => ({
  reviews: many(reviews),
}));

export type User = InferSelectModel<typeof user>;
