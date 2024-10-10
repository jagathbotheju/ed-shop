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
      const newImages = await db.insert(variantImages).values(
        variantData.images.map((image, index) => ({
          name: image.name,
          size: image.size,
          url: image.url,
          order: index.toString(),
          variantId: editVariant[0].id,
        }))
      );

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

      const newImages = await db.insert(variantImages).values(
        variantData.images.map((image, index) => ({
          name: image.name,
          size: image.size,
          url: image.url,
          order: index.toString(),
          variantId: newVariant[0].id,
        }))
      );

      if (newVariant && newTags && newImages) {
        return { success: "New variant created successfully" };
      }

      return { success: "Could not create new Variant" };
    }
  } catch (error) {
    return { error: "Could not create or edit a Variant" };
  }
};
