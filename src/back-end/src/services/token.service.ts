import jwt from 'jsonwebtoken'
import { JwtPayload } from '@/types/jwt'

export class TokenService {

  private static secret = process.env.JWT_SECRET as string
  private static refreshSecret = process.env.JWT_REFRESH_SECRET as string

  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(
      payload,
      this.secret,
      { expiresIn: '1d' }
    )
  }

  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(
      payload,
      this.refreshSecret,
      { expiresIn: '7d' }
    )
  }

  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(
      token,
      this.secret
    ) as JwtPayload
  }

  static verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(
      token,
      this.refreshSecret
    ) as JwtPayload
  }

}