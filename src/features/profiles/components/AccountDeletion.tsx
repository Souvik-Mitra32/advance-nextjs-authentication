"use client"

import { BetterAuthActionButton } from "@/features/auth/components/BetterAuthActionButton"
import { authClient } from "@/features/auth/lib/auth-client"

export function AccountDeletion() {
  return (
    <BetterAuthActionButton
      requireAreYouSure
      variant="destructive"
      className="w-full"
      successMessage="Account deletion initiated. Please check your email to confirm."
      action={() => authClient.deleteUser({ callbackURL: "/" })}
    >
      Delete Account Permanently
    </BetterAuthActionButton>
  )
}
