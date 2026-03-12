import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "@/types/error";
import { JwtPayload } from "@/types/jwt";
import { AuthRequest } from "@/types/http";
import { ErrorMessages } from "@/utils/constants";

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(
      "Token não informado",
      401,
      ErrorMessages.InvalidToken
    );
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new AppError(
      "Formato de token inválido",
      401,
      ErrorMessages.InvalidToken
    );
  }

  const token = parts[1];

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET não definido");
  }

  try {

    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    return next();

  } catch(error) {
    throw new AppError(
      "Token inválido ou expirado",
      401,
      ErrorMessages.InvalidToken
    );
  }
}