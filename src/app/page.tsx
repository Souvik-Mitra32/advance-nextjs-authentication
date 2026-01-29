"use client"

import Link from "next/link"

import { authClient } from "@/lib/auth-client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BetterAuthActionButton } from "@/features/auth/components/BetterAuthActionButton"

export default function HomePage() {
  const { data: session, isPending: isLoading } = authClient.useSession()

  if (isLoading)
    return (
      <div className="my-6 px-4 max-w-md mx-auto">
        <Skeleton className="h-7.5 w-[18ch] mx-auto rounded-full" />
      </div>
    )

  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        {session == null ? (
          <>
            <h1 className="text-3xl font-bold">Welcome to Our App</h1>
            <Button size="lg" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Welcome {session.user.name}</h1>
            <BetterAuthActionButton
              variant="destructive"
              action={() => {
                return authClient.signOut()
              }}
            >
              Sign out
            </BetterAuthActionButton>
          </>
        )}
      </div>
    </div>
  )
}
