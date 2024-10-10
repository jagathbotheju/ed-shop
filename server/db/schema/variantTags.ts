import { pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { products } from "./products";
import { InferSelectModel, relations } from "drizzle-orm";
import { productVariants } from "./productVariants";

export const variantTags = pgTable("variant_tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  variantId: text("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export type VariantTag = InferSelectModel<typeof variantTags>;

export const variantTagRelations = relations(variantTags, ({ one }) => ({
  productVariants: one(productVariants, {
    fields: [variantTags.variantId],
    references: [productVariants.id],
  }),
}));
