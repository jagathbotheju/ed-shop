import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { Product, products } from "./products";
import { InferSelectModel, relations } from "drizzle-orm";
import { VariantImage, variantImages } from "./variantImages";
import { VariantTag, variantTags } from "./variantTags";

export const productVariants = pgTable("product_variants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  color: text("color").notNull(),
  productType: text("product_type").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export type ProductVariant = InferSelectModel<typeof productVariants>;
export type ProductVariantExt = InferSelectModel<typeof productVariants> & {
  // product: Product;
  variantImages: VariantImage[];
  variantTags: VariantTag[];
};

export const productVariantRelations = relations(
  productVariants,
  ({ one, many }) => ({
    products: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    variantImages: many(variantImages),
    variantTags: many(variantTags),
  })
);
