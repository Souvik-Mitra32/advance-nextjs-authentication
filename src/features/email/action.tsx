"use server"

import { resend } from "@/features/email/lib/resend"

import ResetPasswordEmail from "./components/ResetPasswordEmail"
import AccountVerificationEmail from "./components/AccountVerificationEmail"
import WelcomeEmail from "./components/WelcomeEmail"
import AccountDeleteConfirmationEmail from "./components/AccountDeleteConfirmationEmail"
import OrganizationInvitationEmail from "./components/OrganizationInvitationEmail"

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

export async function sendWelcomeEmail(user: { name: string; email: string }) {
  resend.emails.send({
    from: `Support <${process.env.RESEND_SENDER_EMAIL as string}>`,
    to: user.email,
    subject: "Welcome",
    react: <WelcomeEmail user={user} />,
  })
}

export async function sendAccountDeleteConfirmationEmail({
  user,
  url,
}: {
  user: { name: string; email: string }
  url: string
}) {
  resend.emails.send({
    from: `Support <${process.env.RESEND_SENDER_EMAIL as string}>`,
    to: user.email,
    subject: "Delete confirmation",
    react: <AccountDeleteConfirmationEmail user={user} url={url} />,
  })
}

export async function sendOrganizationInvitationEmail({
  email,
  invitation,
  inviter,
  organization,
}: {
  email: string
  inviter: { name: string }
  organization: { name: string }
  invitation: { id: string }
}) {
  resend.emails.send({
    from: `Support <${process.env.RESEND_SENDER_EMAIL as string}>`,
    to: email,
    subject: `You're invited to join the organization ${organization.name}`,
    react: (
      <OrganizationInvitationEmail
        inviter={inviter}
        organization={organization}
        invitation={invitation}
      />
    ),
  })
}
