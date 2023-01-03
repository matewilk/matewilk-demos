import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import TwitterProvider, { TwitterProfile } from "next-auth/providers/twitter";
import { OAuthUserConfig } from "next-auth/providers";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("redirect", url, baseUrl);
      return baseUrl;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    } as OAuthUserConfig<GoogleProfile>),
  ],
};

export default NextAuth(authOptions);
