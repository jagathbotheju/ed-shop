import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "title is required"),
  description: z
    .string({ required_error: "description is required" })
    .min(1, "description is required"),
  price: z.coerce
    .number({
      required_error: "price is required",
      invalid_type_error: "price must be a number",
    })
    .positive({ message: "must be a positive value" }),
});

export const UserProfileSchema = z
  .object({
    name: z.string(),
    image: z.string().optional(),
    isTwoFactorEnabled: z.boolean().optional(),
    password: z
      .string()
      .min(6, "password must be at least 6 characters")
      .optional(),
    confirmPassword: z
      .string()
      .min(6, "password must be at least 6 characters")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "email address is required")
    .email("please provide valid e-mail address"),
});

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters"),
    token: z.string().optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "email address is required")
    .email("please provide valid e-mail address"),
  password: z
    .string()
    .min(1, "password is required")
    .refine((pw) => pw.length > 6, {
      message: "at least 6 characters required",
    }),
  otp: z.string().optional(),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(1, "name is required"),
    email: z
      .string()
      .min(1, "email address is required")
      .email("please provide valid e-mail address"),
    password: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });
