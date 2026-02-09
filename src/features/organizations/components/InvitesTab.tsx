"use client"

import { authClient } from "@/features/auth/lib/auth-client"

import { Badge } from "@/components/ui/badge"
import { BetterAuthActionButton } from "@/features/auth/components/BetterAuthActionButton"
import { CreateInviteButton } from "./CreateInviteButton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { X } from "lucide-react"

export function InvitesTab() {
  const { data: activeOrganization } = authClient.useActiveOrganization()
  if (activeOrganization == null) return null

  const pendingInvites = activeOrganization?.invitations?.filter(
    (invite) => invite.status === "pending",
  )

  async function cancelInvitation(invitationId: string) {
    return authClient.organization.cancelInvitation({ invitationId })
  }

  return (
    <div className="space-y-4">
      <div className="justify-end flex">
        <CreateInviteButton />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingInvites?.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell>{invitation.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{invitation.role}</Badge>
              </TableCell>
              <TableCell>
                {new Date(invitation.expiresAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <BetterAuthActionButton
                  variant="destructive"
                  size="icon"
                  action={() => cancelInvitation(invitation.id)}
                >
                  <X />
                </BetterAuthActionButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
