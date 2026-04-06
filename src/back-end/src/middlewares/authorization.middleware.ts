import { UserRole } from "@/models/user.model";
import { AuthRequest } from "@/types/http";
import { AppError } from "@/types/error";
import { ErrorMessages } from "@/utils/constants";
import { NextFunction, Response } from "express";

export function authorize(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(
        "Usuário não autenticado",
        401,
        ErrorMessages.InvalidToken
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        "Usuário não possui permissão para acessar este recurso",
        403,
        "Forbidden"
      );
    }

    return next();
  };
}
