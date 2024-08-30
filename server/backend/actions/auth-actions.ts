"use server";
import { createSafeActionClient } from "next-safe-action";
import {
  LoginSchema,
  RegisterSchema,
  NewPasswordSchema,
  ResetPasswordSchema,
} from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateTwoFactorToken,
  getPasswordResetTokenByToken,
} from "./token-actions";
import {
  sendPasswordResetEmail,
  sendTwoFactorTokenByEmail,
  sendVerificationEmail,
} from "./email-actions";
import { AuthError } from "next-auth";
import { db } from "../../db";
import {
  emailToken,
  passwordResetToken,
  twoFactorToken,
  user,
} from "../../db/schema";
import { signIn } from "@/lib/auth";

const actionClient = createSafeActionClient();

/***************RESET PASSWORD *********************************************/
export const resetPassword = actionClient
  .schema(ResetPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });
    if (!existingUser) return { error: "No user fond" };

    const passwordResetToken = await generatePasswordResetToken(email);
    if (!passwordResetToken) return { error: "Could not generate " };

    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token
    );

    return { success: "Reset password Email Sent" };
  });

/***************NEW PASSWORD ***********************************************/
export const newPassword = actionClient
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    try {
      if (!token) return { error: "Token is required" };

      const existingToken = await getPasswordResetTokenByToken(token);
      if (!existingToken) return { error: "Token not found" };

      const hasExpired = new Date(existingToken.expires) < new Date();
      if (hasExpired) return { error: "Token expired" };

      const existingUser = await db.query.user.findFirst({
        where: eq(user.email, existingToken.email),
      });
      if (!existingUser) return { error: "User not found" };

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUer = await db
        .update(user)
        .set({
          password: hashedPassword,
        })
        .where(eq(user.id, existingUser.id))
        .returning();

      const deletedToken = await db
        .delete(passwordResetToken)
        .where(eq(passwordResetToken.id, existingToken.id))
        .returning();

      // await db.transaction(async (tx)=>{
      //   await db
      //     .update(user)
      //     .set({
      //       password: hashedPassword,
      //     })
      //     .where(eq(user.id, existingUser.id));
      //   await db
      //     .delete(passwordResetToken)
      //     .where(eq(passwordResetToken.id, existingToken.id));
      // })

      if (updatedUer && deletedToken) {
        return { success: "Password updated successfully, please Login" };
      }

      return { success: "Could not update password, please try again later" };
    } catch (error) {
      console.log("new password error", error);
      return { error: "Internal Server Error" };
    }
  });

/***************SOCIAL SIGN IN ***********************************************/
export const socialSignIn = async ({
  social,
  callback,
}: {
  social: string;
  callback: string;
}) => {
  await signIn(social, { redirectTo: callback });
};

/***************REGISTER USER***********************************************/
export const registerUser = actionClient
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    console.log("regestering....");
    const userExist = await db.query.user.findFirst({
      where: eq(user.email, email),
    });
    if (userExist) {
      return {
        error: "Email already in use, please use different email address",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(user).values({
      email,
      name,
      password: hashedPassword,
    });

    const verificationToken = await generateEmailVerificationToken(email);
    console.log("verification token*******", verificationToken);
    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );

    return { success: "Confirmation Email sent" };
  });

/***************EMAIL SIGN IN ***********************************************/
export const emailSignIn = actionClient
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, otp } }) => {
    try {
      const existingUser = await db.query.user.findFirst({
        where: eq(user.email, email),
      });
      if (!existingUser) return { error: "Invalid Credentials" };

      if (existingUser?.email !== email) {
        return { error: "User not found, please register" };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return {
          success: "Confirmation Email sent, please verify your account",
        };
      }

      if (existingUser.twoFactorEnabled) {
        if (otp) {
          const existTwoFactorToken = await db.query.twoFactorToken.findFirst({
            where: eq(twoFactorToken.email, existingUser.email),
          });
          if (!existTwoFactorToken) return { error: "Invalid Token" };
          if (existTwoFactorToken.token !== otp)
            return { error: "Invalid Token" };
          const hasExpired = new Date(existTwoFactorToken.expires) < new Date();
          if (hasExpired) return { error: "OTP expired" };

          await db
            .delete(twoFactorToken)
            .where(eq(twoFactorToken.id, existTwoFactorToken.id));
        } else {
          const token = await generateTwoFactorToken(existingUser.email);
          if (!token)
            return { error: "Token generate error, please try again" };

          await sendTwoFactorTokenByEmail(existingUser.email, token[0].token);
          return { twoFactor: "OTP sent to your email address" };
        }
      }

      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      return { success: "Successfully LoggedIn" };
    } catch (error) {
      console.log(error);
      return { error: "Invalid Credentials" };
    }
  });
