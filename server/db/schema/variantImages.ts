import { pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { products } from "./products";
import { InferSelectModel, relations } from "drizzle-orm";
import { productVariants } from "./productVariants";

export const variantImages = pgTable("variant_images", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  variantId: text("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  size: real("size").notNull(),
  name: text("name").notNull(),
  order: text("order").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export type VariantImage = InferSelectModel<typeof variantImages>;

export const variantImageRelations = relations(variantImages, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantImages.variantId],
    references: [productVariants.id],
  }),
}));
