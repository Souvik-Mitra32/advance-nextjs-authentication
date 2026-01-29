"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
} from "@/lib/oauth-providers"
import { BetterAuthActionButton } from "./BetterAuthActionButton"

export function SocialAuthButtons() {
  return (
    <div className="w-full grid grid-cols-2 gap-2">
      {SUPPORTED_OAUTH_PROVIDERS.map((provider) => (
        <BetterAuthActionButton
          key={provider}
          variant="outline"
          action={() => {
            return authClient.signIn.social({ provider, callbackURL: "/" })
          }}
        >
          Sign In with {SUPPORTED_OAUTH_PROVIDER_DETAILS[provider].name}
        </BetterAuthActionButton>
      ))}
    </div>
  )
}
