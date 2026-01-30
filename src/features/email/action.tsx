"use server"

import { resend } from "@/lib/resend"

import ResetPasswordEmail from "./components/ResetPasswordEmail"
import AccountVerificationEmail from "./components/AccountVerificationEmail"

export async function sendPasswordResetEmail({
  user,
  url,
}: {
  user: { name: string; email: string }
  url: string
}) {
  resend.emails.send({
    from: `Support <${process.env.RESEND_SENDER_EMAIL as string}>`,
    to: user.email,
    subject: "Password reset",
    react: <ResetPasswordEmail user={user} url={url} />,
  })
}

export async function sendVerificationEmail({
  user,
  url,
}: {
  user: { name: string; email: string }
  url: string
}) {
  resend.emails.send({
    from: `Support <${process.env.RESEND_SENDER_EMAIL as string}>`,
    to: user.email,
    subject: "Email verification",
    react: <AccountVerificationEmail user={user} url={url} />,
  })
}
