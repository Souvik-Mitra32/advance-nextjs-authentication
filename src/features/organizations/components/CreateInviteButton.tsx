"use client"

import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useState } from "react"

import { authClient } from "@/features/auth/lib/auth-client"

import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  email: z.email().min(1).trim(),
  role: z.enum(["member", "admin"]),
})

export function CreateInviteButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { control, handleSubmit, formState, watch, reset } = useForm<
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await authClient.organization.inviteMember(data, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to invite user")
      },
      onSuccess: () => {
        reset()
        setIsDialogOpen(false)
      },
    })
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(o) => {
        if (o) reset()
        setIsDialogOpen(o)
      }}
    >
      <DialogTrigger asChild>
        <Button>Create Invite</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Invite</DialogTitle>
          <DialogDescription>
            Invite users to collaborate with your team.
          </DialogDescription>
        </DialogHeader>

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
                name="role"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                    <Select
                      {...field}
                      defaultValue="member"
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-45">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
                    formState.isSubmitting || watch("email").trim() === ""
                  }
                >
                  <LoadingSwap isLoading={formState.isSubmitting}>
                    Invite
                  </LoadingSwap>
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}
