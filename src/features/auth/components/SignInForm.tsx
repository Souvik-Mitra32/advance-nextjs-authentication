"use client"

import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { authClient } from "@/lib/auth-client"

import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"

const formSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Must be minimum 6 characters")
    .max(24, "Must be maximum 24 characters"),
})

export function SignInForm() {
  const router = useRouter()
  const { control, handleSubmit, formState } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await authClient.signIn.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to sign in")
        },
        onSuccess: () => {
          router.push("/")
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  type="email"
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

          <Field orientation="vertical">
            <Button type="submit" disabled={formState.isSubmitting}>
              <LoadingSwap isLoading={formState.isSubmitting}>
                Sign In
              </LoadingSwap>
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
