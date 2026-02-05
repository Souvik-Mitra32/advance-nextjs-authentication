"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { authClient } from "@/features/auth/lib/auth-client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BetterAuthActionButton } from "@/features/auth/components/BetterAuthActionButton"

export default function HomePage() {
  const { data: session, isPending: isLoading } = authClient.useSession()
  const [hasAdminPermission, setHasAdminPermission] = useState(false)

  useEffect(() => {
    authClient.admin
      .hasPermission({ permission: { user: ["list"] } })
      .then(({ data }) => {
        setHasAdminPermission(data?.success ?? false)
      })
  }, [])

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
            <h1 className="text-3xl font-bold">Welcome to Better Auth</h1>
            <Button size="lg" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Welcome {session.user.name}</h1>
            <div className="flex flex-wrap justify-center items-center gap-2">
              <Button asChild>
                <Link href="/profile">Profile</Link>
              </Button>

              {hasAdminPermission && (
                <Button variant="outline" asChild>
                  <Link href="/admin">Admin</Link>
                </Button>
              )}

              <BetterAuthActionButton
                variant="destructive"
                action={() => {
                  return authClient.signOut()
                }}
              >
                Sign out
              </BetterAuthActionButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
