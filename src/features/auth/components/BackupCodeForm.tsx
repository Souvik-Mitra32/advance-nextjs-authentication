"use client"

import { useRouter } from "next/navigation"
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
  code: z.string().min(1),
})

export function BackupCodeForm() {
  const router = useRouter()
  const { control, handleSubmit, formState, watch } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await authClient.twoFactor.verifyBackupCode(
      {
        code: data.code,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to verify backup code")
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
            name="code"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Backup Code</FieldLabel>
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

          <Field>
            <Button
              type="submit"
              disabled={formState.isSubmitting || watch("code").trim() === ""}
            >
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
