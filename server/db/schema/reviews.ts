import { pgTable, text, real, timestamp, index } from "drizzle-orm/pg-core";
import { User, user } from "./user";
import { ProductExt, products } from "./products";
import { InferSelectModel, relations } from "drizzle-orm";

export const reviews = pgTable(
  "reviews",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    rating: real("rating").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    comment: text("comment").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      productIndex: index("productIndex").on(table.productId),
      userIndex: index("userIndex").on(table.userId),
    };
  }
);

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(user, {
    fields: [reviews.userId],
    references: [user.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

export type Review = InferSelectModel<typeof reviews> & {
  // products:ProductExt,
  user: User;
};
