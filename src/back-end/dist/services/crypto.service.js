"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class CryptoService {
    static async hashPassword(password) {
        return bcrypt_1.default.hash(password, 10);
    }
    static async verifyPassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
}
exports.CryptoService = CryptoService;
