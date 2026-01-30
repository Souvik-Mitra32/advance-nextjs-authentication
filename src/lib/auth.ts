import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { db } from "@/drizzle/db"
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/features/email/action"

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user, url })
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({ user, url })
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minute
    },
  },
  plugins: [nextCookies()],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
})
