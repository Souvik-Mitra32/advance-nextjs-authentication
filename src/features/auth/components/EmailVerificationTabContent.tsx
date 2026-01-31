"use client"

import { useEffect, useRef, useState } from "react"

import { authClient } from "@/features/auth/lib/auth-client"
import { BetterAuthActionButton } from "./BetterAuthActionButton"
import { DEFAULT_RESEND_EMAIL_TIMER } from "../data/constants"
import { Button } from "@/components/ui/button"

export function EmailVerificationTabContent({
  email,
  openSignInTab,
}: {
  email: string
  openSignInTab: () => void
}) {
  const [timeToNextResend, setTimeToNextResend] = useState(
    DEFAULT_RESEND_EMAIL_TIMER,
  )
  const interval = useRef<NodeJS.Timeout>(undefined)

  function startEmailVerificationCountdown(time = DEFAULT_RESEND_EMAIL_TIMER) {
    setTimeToNextResend(time)

    clearInterval(interval.current)
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1

        if (newT <= 0) {
          clearInterval(interval.current)
          return 0
        }
        return newT
      })
    }, 1000)
  }

  useEffect(() => {
    startEmailVerificationCountdown()
  }, [])

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mt-2">
        We have sent you a verification link on{" "}
        <span className="text-accent-foreground">{email}</span>. Please check
        your email and click the link to verify your account.
      </p>

      <div className="flex flex-wrap gap-2 items-center">
        <BetterAuthActionButton
          variant="outline"
          onClick={() => startEmailVerificationCountdown()}
          action={async () => {
            startEmailVerificationCountdown()
            return await authClient.sendVerificationEmail({
              email,
              callbackURL: "/",
            })
          }}
          successMessage="Verification email sent!"
          disabled={timeToNextResend > 0}
        >
          Resend {timeToNextResend > 0 && `(${timeToNextResend})`}
        </BetterAuthActionButton>

        <Button variant="ghost" onClick={openSignInTab}>
          Back
        </Button>
      </div>
    </div>
  )
}
