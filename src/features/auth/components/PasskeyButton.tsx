"use client"

import { useRouter } from "next/navigation"

import { BetterAuthActionButton } from "@/features/auth/components/BetterAuthActionButton"
import { authClient } from "@/features/auth/lib/auth-client"

export function PasskeyButton() {
  const router = useRouter()
  const { refetch } = authClient.useSession()

  return (
    <BetterAuthActionButton
      variant="outline"
      action={() =>
        authClient.signIn.passkey(undefined, {
          onSuccess: () => {
            refetch()
            router.push("/")
          },
        })
      }
    >
      Use passkey
    </BetterAuthActionButton>
  )
}
