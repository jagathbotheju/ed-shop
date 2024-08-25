import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { LoginSchema } from "./schema";
import { user as userDB } from "@/server/db/schema";
import { compare } from "bcryptjs";
import { User } from "@/server/db/schema/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  debug: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),

    Github({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),

    Credentials({
      authorize: async (credentials) => {
        const validated = LoginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;
        console.log("credentials email*****", email);
        console.log("credentials password*****", password);
        const existUser = await db.query.user.findFirst({
          where: eq(userDB.email, email),
        });

        if (!existUser || !existUser.password) return null;
        const matchPassword = await compare(password, existUser.password);
        console.log("match password", matchPassword);
        if (!matchPassword) return null;

        return existUser as User;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // console.log("next auth user******", user);
      return true;
    },
    async session({ token, session }) {
      const tokenUser = token.user as User;
      if (tokenUser) {
        session.user = tokenUser;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
  },
});
