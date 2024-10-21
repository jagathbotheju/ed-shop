import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { ProductVariantExt, productVariants } from "./productVariants";
import { reviews } from "./reviews";

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export type Product = InferSelectModel<typeof products>;
export type ProductExt = InferSelectModel<typeof products> & {
  productVariants: ProductVariantExt[];
};

export const productRelations = relations(products, ({ many }) => ({
  productVariants: many(productVariants),
  reviews: many(reviews),
}));
