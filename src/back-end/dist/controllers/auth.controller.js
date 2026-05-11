"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
const auth_service_1 = require("@/services/auth.service");
const token_service_1 = require("@/services/token.service");
const error_1 = require("@/types/error");
const constants_1 = require("@/utils/constants");
function buildCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";
    const sameSite = isProduction ? "none" : "lax";
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: sameSite,
        maxAge: 1000 * 60 * 60 * 24
    };
}
async function login(req, res) {
    const { email, password } = req.body;
    const response = await auth_service_1.AuthService.login(email, password);
    const { token, refreshToken, user } = response;
    const cookieOptions = buildCookieOptions();
    res.cookie("access_token", token, {
        ...cookieOptions
    });
    res.cookie("refresh_token", refreshToken, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
    return res.status(200).json({ user, token });
}
async function refresh(req, res) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
        throw new error_1.AppError("Refresh token nao informado", 401, constants_1.ErrorMessages.InvalidToken);
    }
    const payload = token_service_1.TokenService.verifyRefreshToken(refreshToken);
    const token = token_service_1.TokenService.generateAccessToken(payload);
    const cookieOptions = buildCookieOptions();
    res.cookie("access_token", token, {
        ...cookieOptions
    });
    return res.status(200).json({ token });
}
async function logout(req, res) {
    const cookieOptions = buildCookieOptions();
    res.clearCookie("access_token", cookieOptions);
    res.clearCookie("refresh_token", {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 24 * 7
    });
    return res.status(204).send();
}
