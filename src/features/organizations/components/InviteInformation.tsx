"use client"

import { BetterAuthActionButton } from "@/features/auth/components/BetterAuthActionButton"
import { authClient } from "@/features/auth/lib/auth-client"
import { useRouter } from "next/navigation"

export function InviteInformation({
  id: invitationId,
  organizationId,
}: {
  id: string
  organizationId: string
}) {
  const router = useRouter()

  async function acceptInvite() {
    return authClient.organization.acceptInvitation(
      { invitationId },
      {
        onSuccess: async () => {
          await authClient.organization.setActive({ organizationId })
          router.push(`/organizations`)
        },
      },
    )
  }

  async function rejectInvite() {
    return authClient.organization.rejectInvitation(
      { invitationId },
      {
        onSuccess: () => {
          router.push("/")
        },
      },
    )
  }

  return (
    <div className="flex gap-2">
      <BetterAuthActionButton action={acceptInvite}>
        Accept
      </BetterAuthActionButton>
      <BetterAuthActionButton action={rejectInvite} variant="destructive">
        Reject
      </BetterAuthActionButton>
    </div>
  )
}
