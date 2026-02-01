"use client"

import { BetterAuthActionButton } from "@/features/auth/components/BetterAuthActionButton"
import { authClient } from "@/features/auth/lib/auth-client"

export function SetPasswordButton({ email }: { email: string }) {
  return (
    <BetterAuthActionButton
      variant="outline"
      action={async () => {
        return authClient.requestPasswordReset({
          email,
          redirectTo: "/auth/reset-password",
        })
      }}
      successMessage="Reset email sent successfully"
    >
      Send
    </BetterAuthActionButton>
  )
}
