"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { authClient } from "@/features/auth/lib/auth-client"

import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"

const formSchema = z.object({
  email: z.email().min(1, "Email is required"),
})

export function ForgotPasswordForm({
  openSignInTab,
}: {
  openSignInTab: () => void
}) {
  const { control, handleSubmit, formState } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await authClient.requestPasswordReset(
      { ...data, redirectTo: "/auth/reset-password" },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "Failed to send password reset email",
          )
        },
        onSuccess: () => {
          toast.success("Password reset email sent")
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

          <Field orientation="horizontal">
            <Button type="submit" disabled={formState.isSubmitting}>
              <LoadingSwap isLoading={formState.isSubmitting}>Send</LoadingSwap>
            </Button>

            <Button
              variant="outline"
              onClick={openSignInTab}
              disabled={formState.isSubmitting}
            >
              Back
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
