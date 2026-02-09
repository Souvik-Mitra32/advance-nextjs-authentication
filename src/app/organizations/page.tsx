import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/features/auth/lib/auth"

import { ArrowLeft } from "lucide-react"
import { OrganizationTab } from "@/features/organizations/components/OrganizationTab"
import { OrganizationSelect } from "@/features/organizations/components/OrganizationSelect"
import { CreateOrganizationButton } from "@/features/organizations/components/CreateOrganizationButton"

export default async function OrganizationPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session == null) return redirect("/auth/login")

  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      <Link href="/" className="inline-flex items-center mb-6">
        <ArrowLeft className="size-4 mr-2" />
        Back to Home
      </Link>

      <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
        <OrganizationSelect />
        <CreateOrganizationButton />
      </div>

      <OrganizationTab />
    </div>
  )
}
