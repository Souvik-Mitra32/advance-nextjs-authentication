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

const formSchema = z.object({
  name: z.string().min(1),
})

export function CreateOrganizationButton() {
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
    const slug = data.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")

    const res = await authClient.organization.create({
      name: data.name,
      slug,
    })

    if (res.error) {
      toast.error(res.error.message || "Failed to create organization")
    } else {
      ;(reset(), setIsDialogOpen(false))
      authClient.organization.setActive({ organizationId: res.data.id })
    }
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
        <Button>Create Organization</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to collaborate with your team.
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
                    Create
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
