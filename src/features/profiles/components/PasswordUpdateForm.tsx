"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { authClient } from "@/features/auth/lib/auth-client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"

const formSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Must be minimum 6 characters")
    .max(24, "Must be maximum 24 characters"),
  newPassword: z
    .string()
    .min(6, "Must be minimum 6 characters")
    .max(24, "Must be maximum 24 characters"),
  revokeOtherSessions: z.boolean(),
})

export function PasswordUpdateForm() {
  const { control, handleSubmit, formState, watch, reset } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: true,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await authClient.changePassword(data)

    if (res.error) {
      toast.error(res.error.message || "Failed to change password")
    } else {
      toast.success("Password changed successfully")
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={control}
            name="currentPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Current password</FieldLabel>
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

          <Controller
            control={control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>New password</FieldLabel>
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

          <Controller
            control={control}
            name="revokeOtherSessions"
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <Checkbox
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
                <FieldLabel htmlFor={field.name}>
                  Remove from all other sessions
                </FieldLabel>
                {fieldState.error && (
                  <FieldError
                    errors={[{ message: fieldState.error.message }]}
                  />
                )}
              </Field>
            )}
          />

          <Field orientation="vertical">
            <Button
              type="submit"
              disabled={
                formState.isSubmitting ||
                watch("currentPassword") === "" ||
                watch("newPassword") === ""
              }
            >
              <LoadingSwap isLoading={formState.isSubmitting}>
                Change password
              </LoadingSwap>
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
