"use client"

import { useForm, Controller } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { authClient } from "@/features/auth/lib/auth-client"

import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { toast } from "sonner"
import { PasswordInput } from "@/components/ui/password-input"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const formSchema = z.object({
  password: z
    .string()
    .min(6, "Must be minimum 6 characters")
    .max(24, "Must be maximum 24 characters"),
})

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const error = searchParams.get("error")

  const { control, handleSubmit, formState } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (token == null) return

    await authClient.resetPassword(
      { newPassword: data.password, token },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to reset password")
        },
        onSuccess: () => {
          toast.success("Password reset successful", {
            description: "Redirecting to the login page...",
          })
          setTimeout(() => {
            router.push("/auth/login")
          }, 2000)
        },
      },
    )
  }

  if (token == null || error != null)
    return (
      <div className="w-full max-w-md mx-auto my-6 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Invalid reset link
            </CardTitle>
            <CardDescription>
              The password reset link is either invalid or expired.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button>
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )

  return (
    <div className="w-full max-w-md mx-auto my-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Reset your password
          </CardTitle>
          <CardDescription>
            Create a new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup>
                <Controller
                  control={control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                      <PasswordInput
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.error && (
                        <FieldError
                          errors={[{ message: fieldState.error.message }]}
                        />
                      )}
                    </Field>
                  )}
                />

                <Field>
                  <Button type="submit" disabled={formState.isSubmitting}>
                    <LoadingSwap isLoading={formState.isSubmitting}>
                      Continue
                    </LoadingSwap>
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
