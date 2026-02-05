import { createAuthClient } from "better-auth/react"
import {
  inferAdditionalFields,
  twoFactorClient,
  adminClient,
} from "better-auth/client/plugins"
import { passkeyClient } from "@better-auth/passkey/client"

import { auth } from "./auth"
import { ac, user } from "../../admin/lib/permissions"

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = "/auth/2fa"
      },
    }),
    passkeyClient(),
    adminClient({
      ac,
      roles: { user },
    }),
  ],
})
