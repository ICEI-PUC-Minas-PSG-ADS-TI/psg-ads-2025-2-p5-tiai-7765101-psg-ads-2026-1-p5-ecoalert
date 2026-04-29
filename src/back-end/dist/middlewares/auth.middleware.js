"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("@/types/error");
const constants_1 = require("@/utils/constants");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new error_1.AppError("Token não informado", 401, constants_1.ErrorMessages.InvalidToken);
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        throw new error_1.AppError("Formato de token inválido", 401, constants_1.ErrorMessages.InvalidToken);
    }
    const token = parts[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET não definido");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };
        return next();
    }
    catch (error) {
        throw new error_1.AppError("Token inválido ou expirado", 401, constants_1.ErrorMessages.InvalidToken);
    }
}
