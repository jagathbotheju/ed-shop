"use server";
import { ProductSchema } from "@/lib/schema";
import { db } from "@/server/db";
import { products } from "@/server/db/schema/products";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const upsertProduct = async (
  formData: z.infer<typeof ProductSchema>
) => {
  try {
    const { id, title, description, price } = formData;
    if (id) {
      const currentProduct = await db.query.products.findFirst({
        where: eq(products.id, id),
      });
      if (currentProduct) {
        const updatedProduct = await db
          .update(products)
          .set({ title, description, price })
          .where(eq(products.id, id));
        if (updatedProduct) {
          return { success: "Product updated successfully" };
        }
      }
    }

    if (!id) {
      const newProduct = await db
        .insert(products)
        .values({ title, description, price });
      if (newProduct) {
        return { success: "Product created successfully" };
      }
    }

    return { error: "Internal Server Error" };
  } catch (error) {
    console.log(error);
    return { error: "Could not update product" };
  }
};
