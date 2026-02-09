"use client"

import { authClient } from "@/features/auth/lib/auth-client"

import { CalendarCheck, UserPlus, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MembersTab } from "./MembersTab"
import { InvitesTab } from "./InvitesTab"

export function OrganizationTab() {
  const { data: activeOrganization } = authClient.useActiveOrganization()

  return (
    <Tabs className="space-y-2" defaultValue="members">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="members">
          <Users />
          <span className="max-sm:hidden">Members</span>
        </TabsTrigger>
        <TabsTrigger value="invitations">
          <UserPlus />
          <span className="max-sm:hidden">Invitations</span>
        </TabsTrigger>
        <TabsTrigger value="subscriptions">
          <CalendarCheck />
          <span className="max-sm:hidden">Subscriptions</span>
        </TabsTrigger>
      </TabsList>

      {activeOrganization != null && (
        <>
          <TabsContent value="members">
            <Card>
              <CardContent>
                <MembersTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations">
            <Card>
              <CardContent>
                <InvitesTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions"></TabsContent>
        </>
      )}
    </Tabs>
  )
}
