"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignInForm } from "@/features/auth/components/SignInForm"
import { SignUpForm } from "@/features/auth/components/SignUpForm"
import { SocialAuthButtons } from "@/features/auth/components/SocialAuthButtons"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data !== null) router.push("/")
    })
  }, [router])

  return (
    <Tabs defaultValue="signIn" className="w-full max-w-md mx-auto my-6 px-4">
      <TabsList>
        <TabsTrigger value="signIn">Sign In</TabsTrigger>
        <TabsTrigger value="signUp">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signIn">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInForm />
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
            <SignUpForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
