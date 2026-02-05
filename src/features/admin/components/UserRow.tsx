"use client"

import { useRouter } from "next/navigation"

import { UserWithRole } from "better-auth/plugins"
import { authClient } from "@/features/auth/lib/auth-client"

import { toast } from "sonner"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserRow({
  user,
  selfId,
}: {
  user: UserWithRole & { createAtAsLocalString: string }
  selfId: string
}) {
  const router = useRouter()
  const isSelf = user.id === selfId
  const { refetch } = authClient.useSession()

  function banUser(userId: string) {
    authClient.admin.banUser(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to ban user")
        },
        onSuccess: () => {
          toast.success("User banned")
          router.refresh()
        },
      },
    )
  }

  function unbanUser(userId: string) {
    authClient.admin.unbanUser(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to unban user")
        },
        onSuccess: () => {
          toast.success("User unbanned")
          router.refresh()
        },
      },
    )
  }

  function revokeSessions(userId: string) {
    authClient.admin.revokeUserSessions(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to revoke user sessions")
        },
        onSuccess: () => {
          toast.success("User sessions revoked")
        },
      },
    )
  }

  function removeUser(userId: string) {
    authClient.admin.removeUser(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to delete user")
        },
        onSuccess: () => {
          toast.success("User deleted")
          router.refresh()
        },
      },
    )
  }

  function impersonateUser(userId: string) {
    authClient.admin.impersonateUser(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to impersonate user")
        },
        onSuccess: () => {
          refetch()
          router.push("/")
        },
      },
    )
  }

  return (
    <TableRow key={user.id}>
      <TableCell>
        <div>
          <div className="font-medium">{user.name || "No name"}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          <div className="flex items-center gap-2 not-empty:mt-2">
            {user.banned && <Badge variant="destructive">Banned</Badge>}
            {!user.emailVerified && <Badge variant="outline">Unverified</Badge>}
            {isSelf && <Badge>You</Badge>}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {user.role}
        </Badge>
      </TableCell>
      <TableCell>{user.createAtAsLocalString}</TableCell>
      <TableCell>
        {!isSelf && (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => impersonateUser(user.id)}>
                  Impersonate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => revokeSessions(user.id)}>
                  Revoke Sessions
                </DropdownMenuItem>
                {user.banned ? (
                  <DropdownMenuItem onClick={() => unbanUser(user.id)}>
                    Unban User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => banUser(user.id)}>
                    Ban User
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />

                <AlertDialogTrigger asChild>
                  <DropdownMenuItem variant="destructive">
                    Delete User
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this user? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => removeUser(user.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  )
}
