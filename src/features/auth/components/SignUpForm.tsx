"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { authClient } from "@/features/auth/lib/auth-client"

import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
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
import { NumberInput } from "@/components/ui/number-input"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email({ error: "Email is required" }),
  password: z
    .string({ error: "Password is required" })
    .min(6, "Must be minimum 6 characters")
    .max(24, "Must be maximum 24 characters"),
  favouriteNumber: z.number({ error: "Favourite number is required" }).int(),
})

export function SignUpForm({
  openEmailVerificationTab,
}: {
  openEmailVerificationTab: (email: string) => void
}) {
  const { control, handleSubmit, formState } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await authClient.signUp.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to sign up")
        },
      },
    )

    if (res.error == null && !res.data.user.emailVerified)
      openEmailVerificationTab(data.email)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldSet>
        <FieldGroup>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
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
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  type="email"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
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
                  autoComplete="off"
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
            name="favouriteNumber"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Favourite number</FieldLabel>
                <NumberInput
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
            <Button
              type="submit"
              disabled={formState.isSubmitting || !formState.isDirty}
            >
              <LoadingSwap isLoading={formState.isSubmitting}>
                Sign Up
              </LoadingSwap>
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
