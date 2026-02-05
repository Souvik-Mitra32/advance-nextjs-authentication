import { createAccessControl } from "better-auth/plugins"
import { defaultStatements, userAc } from "better-auth/plugins/admin/access"

export const ac = createAccessControl(defaultStatements)

export const user = ac.newRole({
  ...userAc.statements,
  user: [...userAc.statements.user, "list"], // Adding user access to view all users
})
