import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Kakao from "next-auth/providers/kakao"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Kakao({
      clientId: process.env.AUTH_KAKAO_ID!,
      clientSecret: process.env.AUTH_KAKAO_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 180 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
        maxAge: 180 * 24 * 60 * 60,
      },
    },
  },
  events: {
    createUser: async ({ user }) => {
      try {
        const setting = await prisma.systemSettings.findUnique({
          where: { key: 'DEFAULT_STORAGE_LIMIT' }
        });
        
        if (setting?.value) {
          const limit = parseInt(setting.value);
          if (!isNaN(limit)) {
            await prisma.user.update({
              where: { id: user.id },
              data: { storageLimit: limit }
            });
            console.log(`[Auth] Set initial storage limit for user ${user.id} to ${limit}`);
          }
        }
      } catch (error) {
        console.error('[Auth] Failed to set initial storage limit:', error);
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
