"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import QRCode from "react-qr-code"

import { authClient } from "@/features/auth/lib/auth-client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { LoadingSwap } from "@/components/ui/loading-swap"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type TwoFactorData = {
  totpURI: string
  backupCodes: string[]
}

const formSchema = z.object({
  password: z
    .string()
    .min(6, "Must be minimum 6 characters")
    .max(24, "Must be maximum 24 characters"),
})

export function TwoFactorAuth({ isEnabled }: { isEnabled: boolean }) {
  const router = useRouter()
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null)

  const { control, handleSubmit, formState, watch, reset } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (isEnabled) {
      await authClient.twoFactor.disable(
        {
          password: data.password,
        },
        {
          onError: (error) => {
            toast.error(error.error.message || "Failed to disable 2FA")
          },
          onSuccess: () => {
            reset()
            router.refresh()
          },
        },
      )
    } else {
      const result = await authClient.twoFactor.enable({
        password: data.password,
      })

      if (result.error)
        toast.error(result.error.message || "Failed to enable 2FA")

      setTwoFactorData(result.data)
      reset()
    }
  }

  if (twoFactorData != null)
    return (
      <QRCodeVerify
        {...twoFactorData}
        onDone={() => {
          setTwoFactorData(null)
        }}
      />
    )

  return (
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

          <Field orientation="vertical">
            <Button
              type="submit"
              variant={isEnabled ? "destructive" : "default"}
              disabled={
                formState.isSubmitting || watch("password").trim() === ""
              }
            >
              <LoadingSwap isLoading={formState.isSubmitting}>
                {isEnabled ? "Disable 2FA" : "Enable 2FA"}
              </LoadingSwap>
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}

const qrSchema = z.object({
  code: z.string().length(6),
})

function QRCodeVerify({
  totpURI,
  backupCodes,
  onDone,
}: TwoFactorData & { onDone: () => void }) {
  const router = useRouter()
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false)

  const { control, handleSubmit, formState, watch, reset } = useForm<
    z.infer<typeof qrSchema>
  >({
    resolver: zodResolver(qrSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(data: z.infer<typeof qrSchema>) {
    await authClient.twoFactor.verifyTotp(
      {
        code: data.code,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to verify code")
        },
        onSuccess: () => {
          setSuccessfullyEnabled(true)
          router.refresh()
        },
      },
    )
  }

  if (successfullyEnabled) {
    return (
      <>
        <p className="text-sm text-muted-foreground mb-2">
          Save these backup codes in a safe place. You can use them to access
          your account.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {backupCodes.map((code, index) => (
            <div key={index} className="font-mono text-sm">
              {code}
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={onDone}>
          Done
        </Button>
      </>
    )
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldDescription>
            Scan this QR with your authenticator app and enter the code below:
          </FieldDescription>
          <FieldGroup>
            <Controller
              control={control}
              name="code"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Code</FieldLabel>
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

            <Field orientation="vertical">
              <Button
                type="submit"
                disabled={formState.isSubmitting || watch("code").trim() === ""}
              >
                <LoadingSwap isLoading={formState.isSubmitting}>
                  Submit
                </LoadingSwap>
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>

      <div className="p-4 bg-white w-fit">
        <QRCode size={256} value={totpURI} />
      </div>
    </div>
  )
}
