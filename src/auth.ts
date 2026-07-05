import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Resend as ResendClient } from "resend";
import getMongoClientPromise from "@/lib/mongodb";
import {
  buildMagicLinkHtml,
  buildMagicLinkText,
} from "@/lib/emails/magic-link";
import { upsertUserFromAuth } from "@/lib/users";
import { authConfig } from "@/auth.config";

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.RESEND_API_KEY) {
  const resendFrom =
    process.env.RESEND_FROM_EMAIL ??
    "Magnus Kongskov <auto@magnuskongskov.dk>";

  providers.push(
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: resendFrom,
      async sendVerificationRequest({ identifier: to, provider, url }) {
        const resend = new ResendClient(provider.apiKey);
        const { error } = await resend.emails.send({
          from: provider.from ?? resendFrom,
          to,
          subject: "Sign in to your personal trainer dashboard",
          html: buildMagicLinkHtml(url),
          text: buildMagicLinkText(url),
        });

        if (error) {
          throw new Error(`Resend error: ${JSON.stringify(error)}`);
        }
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(getMongoClientPromise, {
    collections: {
      Users: "auth_users",
      Accounts: "auth_accounts",
      Sessions: "auth_sessions",
      VerificationTokens: "auth_verification_tokens",
    },
  }),
  providers,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      await upsertUserFromAuth({
        mail: user.email,
        name: user.name,
      });

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
});
