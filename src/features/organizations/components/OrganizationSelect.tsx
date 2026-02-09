"use client"

import { authClient } from "@/features/auth/lib/auth-client"

import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function OrganizationSelect() {
  const { data: activeOrganization } = authClient.useActiveOrganization()
  const { data: organizations } = authClient.useListOrganizations()

  function setActiveOrganization(organizationId: string) {
    authClient.organization.setActive(
      { organizationId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to switch organization")
        },
      },
    )
  }

  if (organizations == null || organizations.length === 0) return null

  return (
    <Select
      defaultValue={activeOrganization?.id ?? ""}
      onValueChange={setActiveOrganization}
    >
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Organization" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {organizations.map((org) => (
            <SelectItem key={org.id} value={org.id}>
              {org.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
