import { Request } from "express"
import { JwtPayload } from "./jwt"

export interface AuthRequest extends Request {
  user?: JwtPayload
}