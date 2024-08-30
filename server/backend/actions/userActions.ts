"use server";
import { UserProfileSchema } from "@/lib/schema";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const updateUserProfile = async ({
  values,
  userId,
}: {
  values: z.infer<typeof UserProfileSchema>;
  userId: string;
}) => {
  const valid = UserProfileSchema.safeParse(values);
  if (valid.success) {
    const { name, image, isTwoFactorEnabled, password } = valid.data;
    await db
      .update(user)
      .set({
        name,
        image,
        twoFactorEnabled: isTwoFactorEnabled,
        password: password ? await bcrypt.hash(password, 10) : password,
      })
      .where(eq(user.id, userId));
  }
};
