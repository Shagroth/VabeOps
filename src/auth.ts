import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getOrCreateCorrelationId } from "@/lib/logger";
import { sendMagicLinkEmail } from "@/lib/magic-link-send";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM,
      // Overrides @auth/core's default sendVerificationRequest to add a
      // bounded timeout and safe (no token/email-in-the-clear) logging —
      // see AGENTS.md Phase 3/8. Logic lives in magic-link-send.ts so it
      // can be unit-tested without the full NextAuth/Prisma stack.
      async sendVerificationRequest({ identifier, url, provider, request }) {
        const correlationId = getOrCreateCorrelationId(request.headers);
        await sendMagicLinkEmail(
          { identifier, url, apiKey: provider.apiKey, from: provider.from },
          correlationId
        );
      },
    }),
  ],
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // @ts-expect-error - role is a custom field added via Prisma, not part of next-auth's default User type
        session.user.role = user.role;
      }
      return session;
    },
  },
  pages: {
    verifyRequest: "/auth/check-email",
    error: "/auth/error",
  },
});
