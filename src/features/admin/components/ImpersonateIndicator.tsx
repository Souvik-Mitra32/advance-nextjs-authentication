"use client"

import { useRouter } from "next/navigation"
import { BetterAuthActionButton } from "@/features/auth/components/BetterAuthActionButton"
import { authClient } from "@/features/auth/lib/auth-client"
import { UserX } from "lucide-react"

export function ImpersonateIndicator() {
  const router = useRouter()
  const { data: session, refetch } = authClient.useSession()

  if (session?.session.impersonatedBy == null) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <BetterAuthActionButton
        variant="destructive"
        size="icon"
        action={() => {
          return authClient.admin.stopImpersonating(undefined, {
            onSuccess: () => {
              router.push("/admin")
              refetch()
            },
          })
        }}
      >
        <UserX />
      </BetterAuthActionButton>
    </div>
  )
}
