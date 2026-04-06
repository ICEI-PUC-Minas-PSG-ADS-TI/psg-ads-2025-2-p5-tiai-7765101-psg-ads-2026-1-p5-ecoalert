import { UserRole } from "@/models/user.model"

export interface JwtPayload {
  userId: string
  email: string
  role: UserRole
}
