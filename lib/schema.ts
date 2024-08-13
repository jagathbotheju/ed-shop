import { z } from "zod";

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
