"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenService {
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.secret, { expiresIn: '1d' });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.refreshSecret, { expiresIn: '7d' });
    }
    static verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, this.secret);
    }
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, this.refreshSecret);
    }
}
exports.TokenService = TokenService;
TokenService.secret = process.env.JWT_SECRET;
TokenService.refreshSecret = process.env.JWT_REFRESH_SECRET;
