"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const error_1 = require("@/types/error");
const token_service_1 = require("./token.service");
const user_service_1 = require("./user.service");
const constants_1 = require("@/utils/constants");
const crypto_service_1 = require("./crypto.service");
const formatter_1 = require("@/utils/formatter");
class AuthService {
    static async login(email, password) {
        const user = await user_service_1.UserService.findByEmail(email);
        if (!user) {
            throw new error_1.AppError("Credenciais invalidas", 401, constants_1.ErrorMessages.InvalidCredentials);
        }
        const passwordMatches = await crypto_service_1.CryptoService.verifyPassword(password, user.password);
        if (passwordMatches) {
            return {
                token: token_service_1.TokenService.generateAccessToken({
                    userId: user.id,
                    email: user.email,
                    role: user.role
                }),
                refreshToken: token_service_1.TokenService.generateRefreshToken({
                    userId: user.id,
                    email: user.email,
                    role: user.role
                }),
                user: {
                    id: user.id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    cpf: user.cpf,
                    phone: (0, formatter_1.parsePhone)(user.phone),
                    role: user.role,
                    address: user.address ?? undefined
                }
            };
        }
        throw new error_1.AppError("Credenciais invalidas", 401, constants_1.ErrorMessages.InvalidCredentials);
    }
}
exports.AuthService = AuthService;
