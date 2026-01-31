"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { authClient } from "@/features/auth/lib/auth-client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignInForm } from "@/features/auth/components/SignInForm"
import { SignUpForm } from "@/features/auth/components/SignUpForm"
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons"
import { EmailVerificationTabContent } from "@/features/auth/components/EmailVerificationTabContent"
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm"

type Tab = "signIn" | "signUp" | "emailVerification" | "forgotPassword"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [selectedTab, setSelectedTab] = useState<Tab>("signIn")

  function openEmailVerificationTab(email: string) {
    setEmail(email)
    setSelectedTab("emailVerification")
  }

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data !== null) router.push("/")
    })
  }, [router])

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(t) => setSelectedTab(t as Tab)}
      className="w-full max-w-md mx-auto my-6 px-4"
    >
      {(selectedTab === "signIn" || selectedTab === "signUp") && (
        <TabsList>
          <TabsTrigger value="signIn">Sign In</TabsTrigger>
          <TabsTrigger value="signUp">Sign Up</TabsTrigger>
        </TabsList>
      )}

      <TabsContent value="signIn">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInForm
              openEmailVerificationTab={openEmailVerificationTab}
              openForgotPasswordTab={() => setSelectedTab("forgotPassword")}
            />
          </CardContent>

          <Separator />

          <CardFooter>
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="signUp">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpForm openEmailVerificationTab={openEmailVerificationTab} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="emailVerification">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Verify your email address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmailVerificationTabContent
              email={email}
              openSignInTab={() => setSelectedTab("signIn")}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="forgotPassword">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Forgot password
            </CardTitle>
            <CardDescription>
              We will send a password reset link to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm
              openSignInTab={() => setSelectedTab("signIn")}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
