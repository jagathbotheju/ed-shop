"use server";
import { VariantSchema } from "@/lib/schema";
import { db } from "@/server/db";
import {
  products,
  productVariants,
  variantImages,
  variantTags,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { algoliasearch } from "algoliasearch";
import { ProductVariantExt } from "@/server/db/schema/productVariants";

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID as string,
  process.env.ALGOLIA_ADMIN as string
);

export const getVariants = async () => {
  const variants = await db.query.productVariants.findMany({
    with: {
      products: true,
      variantImages: true,
      variantTags: true,
    },
  });
  return variants as ProductVariantExt[];
};

export const deleteVariant = async (variantId: string) => {
  const deletedVariant = await db
    .delete(productVariants)
    .where(eq(productVariants.id, variantId))
    .returning();
  algoliaClient.deleteObject({
    indexName: "products",
    objectID: deletedVariant[0].id,
  });
  if (deletedVariant) return { success: "Variant deleted successfully" };
  return { success: "Could not delete Variant" };
};

export const upsertVariant = async ({
  variantData,
  id,
  productId,
  editMode = false,
}: {
  variantData: z.infer<typeof VariantSchema>;
  id?: string;
  productId: string;
  editMode: boolean;
}) => {
  try {
    if (editMode && id) {
      const editVariant = await db
        .update(productVariants)
        .set({
          productType: variantData.type,
          color: variantData.color,
        })
        .where(eq(productVariants.id, id))
        .returning();

      await db
        .delete(variantTags)
        .where(eq(variantTags.variantId, editVariant[0].id));
      const newTags = await db.insert(variantTags).values(
        variantData.tags.map((tag) => ({
          tag,
          variantId: editVariant[0].id,
        }))
      );

      await db
        .delete(variantImages)
        .where(eq(variantImages.variantId, editVariant[0].id));
      const newImages = await db
        .insert(variantImages)
        .values(
          variantData.images.map((image, index) => ({
            name: image.name,
            size: image.size,
            url: image.url,
            key: image.key,
            order: index.toString(),
            variantId: editVariant[0].id,
          }))
        )
        .returning();

      algoliaClient.partialUpdateObjects({
        indexName: "products",
        objects: [
          {
            objectID: editVariant[0].id,
            id: editVariant[0].productId,
            productType: editVariant[0].productType,
            variantImages: newImages.map((image) => ({
              id: image.id,
              name: image.name,
              url: image.url,
            })),
          },
        ],
      });

      if (editVariant && newTags && newImages) {
        return { success: "Variant updated successfully" };
      }

      return { success: "Could not update variant" };
    }

    if (!editMode) {
      const newVariant = await db
        .insert(productVariants)
        .values({
          color: variantData.color,
          productType: variantData.type,
          productId: productId,
        })
        .returning();

      const newTags = await db.insert(variantTags).values(
        variantData.tags.map((tag) => ({
          tag,
          variantId: newVariant[0].id,
        }))
      );

      const newImages = await db
        .insert(variantImages)
        .values(
          variantData.images.map((image, index) => ({
            name: image.name,
            size: image.size,
            url: image.url,
            order: index.toString(),
            key: image.key,
            variantId: newVariant[0].id,
          }))
        )
        .returning();

      // save details to algolia index
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, productId));
      if (product) {
        algoliaClient.saveObjects({
          indexName: "products",
          objects: [
            {
              objectID: newVariant[0].id,
              id: newVariant[0].productId,
              title: product[0].title,
              price: product[0].price,
              productType: newVariant[0].productType,
              variantImages: newImages.map((image) => ({
                id: image.id,
                name: image.name,
                url: image.url,
              })),
            },
          ],
        });
      }

      if (newVariant && newTags && newImages) {
        return { success: "New variant created successfully" };
      }

      return { success: "Could not create new Variant" };
    }
  } catch (error) {
    return { error: "Could not create or edit a Variant" };
  }
};
