"use client"

import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Passkey } from "@better-auth/passkey"
import { useState } from "react"

import { authClient } from "@/features/auth/lib/auth-client"

import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { BetterAuthActionButton } from "@/features/auth/components/BetterAuthActionButton"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const formSchema = z.object({
  name: z.string().min(1),
})

export function PasskeyManagement({ passkeys }: { passkeys: Passkey[] }) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { control, handleSubmit, formState, watch, reset } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await authClient.passkey.addPasskey(
      {
        name: data.name,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to add passkey")
        },
        onSuccess: () => {
          router.refresh()
          setIsDialogOpen(false)
        },
      },
    )
  }

  async function deletePasskey(passkeyId: string) {
    return authClient.passkey.deletePasskey(
      {
        id: passkeyId,
      },
      {
        onSuccess: () => {
          router.refresh()
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      {passkeys.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No passkeys yet</CardTitle>
            <CardDescription>
              Add your first passkey for secure, passwordless authentication.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {passkeys.map((passkey) => (
            <Card key={passkey.id}>
              <CardHeader className="flex gap-2 items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>{passkey.name}</CardTitle>
                  <CardDescription>
                    Created {new Date(passkey.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <BetterAuthActionButton
                  requireAreYouSure
                  variant="destructive"
                  size="icon"
                  action={() => deletePasskey(passkey.id)}
                >
                  <Trash2 />
                </BetterAuthActionButton>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(o) => {
          if (o) reset()
          setIsDialogOpen(o)
        }}
      >
        <DialogTrigger asChild>
          <Button>New Passkey</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Passkey</DialogTitle>
            <DialogDescription>
              Create a new passkey for secure, passwordless authentication.
            </DialogDescription>
          </DialogHeader>

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

                <Field orientation="vertical">
                  <Button
                    type="submit"
                    disabled={
                      formState.isSubmitting || watch("name").trim() === ""
                    }
                  >
                    <LoadingSwap isLoading={formState.isSubmitting}>
                      Submit
                    </LoadingSwap>
                  </Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
