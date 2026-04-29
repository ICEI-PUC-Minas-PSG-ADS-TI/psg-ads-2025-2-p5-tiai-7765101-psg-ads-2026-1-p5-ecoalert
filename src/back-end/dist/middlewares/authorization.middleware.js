"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
const error_1 = require("@/types/error");
const constants_1 = require("@/utils/constants");
function authorize(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            throw new error_1.AppError("Usuário não autenticado", 401, constants_1.ErrorMessages.InvalidToken);
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw new error_1.AppError("Usuário não possui permissão para acessar este recurso", 403, "Forbidden");
        }
        return next();
    };
}
