"use server";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { emailToken, passwordResetToken, user } from "../db/schema";

export const verifyEmailToken = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) return { error: "No token found" };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired" };

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, existingToken.email),
  });

  if (!existingUser) return { error: "Email does not exist" };

  await db
    .update(user)
    .set({ emailVerified: new Date() })
    .where(eq(user.email, existingToken.email));
  // await db.update(user)
  // .where:eq(user.email,existingToken.email)
  // .set({
  //   emailVerified: new Date()
  // });

  // await db.delete(emailToken).where(eq(emailToken.id, existingToken.id));
  return { success: "Email Verified, please Login" };
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.emailToken.findFirst({
      where: eq(emailToken.email, email),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.emailToken.findFirst({
      where: eq(emailToken.token, token),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.delete(emailToken).where(eq(emailToken.id, existingToken.id));
  }

  const verificationToken = await db
    .insert(emailToken)
    .values({
      email,
      token,
      expires,
    })
    .returning();
  console.log("generated verification token*******", verificationToken);

  return verificationToken;
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetTokenDB = await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, token),
    });
    return passwordResetTokenDB;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetTokenDB = await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.email, email),
    });
    return passwordResetTokenDB;
  } catch (error) {
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
      await db
        .delete(passwordResetToken)
        .where(eq(passwordResetToken.email, email));
    }

    const newPasswordResetToken = await db
      .insert(passwordResetToken)
      .values({
        email,
        token,
        expires,
      })
      .returning();
    return newPasswordResetToken;
  } catch (error) {
    return null;
  }
};
