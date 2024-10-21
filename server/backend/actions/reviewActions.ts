"use server";
import { auth } from "@/lib/auth";
import { ReviewSchema } from "@/lib/schema";
import { db } from "@/server/db";
import { reviews } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const addReview = async ({
  reviewData,
  productId,
}: {
  reviewData: z.infer<typeof ReviewSchema>;
  productId: string;
}) => {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return { error: "Please login to add Review" };
  }

  const reviewExist = await db.query.reviews.findFirst({
    where: and(eq(reviews.productId, productId), eq(reviews.userId, user.id)),
  });
  if (reviewExist) return { error: "You already reviewed this product" };

  const newReview = await db
    .insert(reviews)
    .values({
      comment: reviewData.comment,
      rating: reviewData.rating,
      userId: user.id,
      productId: productId,
    })
    .returning();

  if (newReview) return { success: "Review created successfully" };
  return { error: "Review could not be created" };
};