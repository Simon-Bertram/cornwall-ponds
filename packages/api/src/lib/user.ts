import type { Session } from "@cornwall-ponds/auth"
import type { PortalUser } from "./portal-access"

export function sessionUserToPortalUser(
	sessionUser: Session["user"],
): PortalUser {
	const role =
		typeof sessionUser.role === "string" ? sessionUser.role : "customer"
	return {
		id: sessionUser.id,
		email: sessionUser.email,
		name: sessionUser.name,
		role,
	}
}
