"use server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.BASE_URL;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/email-verification/?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "ed-Shop | Confirmation Email",
    html: `<p>Click to <a href=${confirmLink}>Confirm your email</a></p>`,
  });
  if (error) return console.log(error);
  if (data) return data;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-password/?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "ed-Shop | Confirmation Email",
    html: `<p>Click to <a href=${confirmLink}>Reset your password</a></p>`,
  });
  if (error) return console.log(error);
  if (data) return data;
};

export const sendTwoFactorTokenByEmail = async (
  email: string,
  token: string
) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Your two factor login token",
    html: `<p>Click to <a href=${token}>Reset your password</a>${token}</p>`,
  });
};
