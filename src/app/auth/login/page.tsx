import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignInForm } from "@/features/auth/components/SignInForm"
import { SignUpForm } from "@/features/auth/components/SignUpForm"

export default function LoginPage() {
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
