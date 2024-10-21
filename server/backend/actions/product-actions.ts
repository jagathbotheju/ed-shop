"use server";
import { ProductSchema } from "@/lib/schema";
import { db } from "@/server/db";
import { productVariants } from "@/server/db/schema";
import { Product, ProductExt, products } from "@/server/db/schema/products";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const deleteProduct = async (productId: string) => {
  try {
    const deletedProduct = await db
      .delete(products)
      .where(eq(products.id, productId));
    if (deletedProduct) {
      return { success: "Product deleted successfully" };
    }
  } catch (error) {
    return { error: "Could not delete product" };
  }
};

export const getProducts = async () => {
  const products = await db.query.products.findMany({
    with: {
      productVariants: {
        with: {
          variantImages: true,
          variantTags: true,
          products: {
            columns: { price: true, id: true },
          },
        },
      },
    },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
  return products as ProductExt[];
};

export const getProductById = async (productId: string) => {
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      productVariants: {
        with: {
          variantImages: true,
          variantTags: true,
          products: true,
        },
      },
    },
  });
  if (product) return product as ProductExt;
  return null;
};

export const upsertProduct = async (
  formData: z.infer<typeof ProductSchema>
) => {
  try {
    const { id, title, description, price } = formData;
    console.log("id", id);
    console.log("title", title);
    console.log("description", description);
    console.log("price", price);
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
