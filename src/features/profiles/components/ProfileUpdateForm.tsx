"use client"

import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation"
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
import { NumberInput } from "@/components/ui/number-input"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email({ error: "Email is required" }),
  favouriteNumber: z.number({ error: "Favourite number is required" }).int(),
})

export function ProfileUpdateForm({
  user,
}: {
  user: { name: string; email: string; favouriteNumber: number }
}) {
  const router = useRouter()

  const { control, handleSubmit, formState } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: user,
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const promises = [
      authClient.updateUser({
        name: data.name,
        favouriteNumber: data.favouriteNumber,
      }),
    ]

    if (user.email !== data.email)
      promises.push(
        authClient.changeEmail({
          newEmail: data.email,
          callbackURL: "/profile",
        }),
      )

    const res = await Promise.all(promises)
    const updateUserResult = res[0]
    const changeEmailResult = res[1] ?? { error: false }

    if (updateUserResult.error) {
      toast.error(updateUserResult.error.message || "Failed to update profile")
    } else if (changeEmailResult.error) {
      toast.error(changeEmailResult.error.message || "Failed to change email")
    } else {
      if (user.email !== data.email) {
        toast.success("Verify your new email address to complete the change")
      } else {
        toast.success("Profile updated successfully")
      }

      router.refresh()
    }
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
              <LoadingSwap isLoading={formState.isSubmitting}>Save</LoadingSwap>
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
