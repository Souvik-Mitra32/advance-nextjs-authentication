import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/features/auth/lib/auth"

import { InviteInformation } from "@/features/organizations/components/InviteInformation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function InvititationPage({
  params,
}: {
  params: Promise<{ inviteId: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session == null) return redirect("/auth/login")

  const { inviteId } = await params

  const invitation = await auth.api
    .getInvitation({
      headers: await headers(),
      query: { id: inviteId },
    })
    .catch(() => {
      redirect("/")
    })
  return (
    <div className="w-full max-w-md mx-auto my-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Organization Invitation</CardTitle>
          <CardDescription>
            You have been invited to join the {invitation.organizationName}{" "}
            organization as a {invitation.role}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteInformation {...invitation} />
        </CardContent>
      </Card>
    </div>
  )
}
