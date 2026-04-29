import { AuthService } from "@/services/auth.service";
import { TokenService } from "@/services/token.service";
import { AppError } from "@/types/error";
import { ErrorMessages } from "@/utils/constants";
import { Request, Response } from "express";

function buildCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";
    const sameSite = isProduction ? "none" : "lax";

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: sameSite as "none" | "lax",
        maxAge: 1000 * 60 * 60 * 24
    };
}

export async function login(req: Request, res: Response) {
    console.log("Login request received with body:", req.body);
    const { email, password } = req.body;

    const response = await AuthService.login(email, password);

    const { token, refreshToken, user } = response;
    const cookieOptions = buildCookieOptions();

    res.cookie("access_token", token, {
        ...cookieOptions
    });

    res.cookie("refresh_token", refreshToken, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return res.status(200).json({user, token});
}

export async function refresh(req: Request, res: Response) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
        throw new AppError(
            "Refresh token nao informado",
            401,
            ErrorMessages.InvalidToken
        );
    }

    const payload = TokenService.verifyRefreshToken(refreshToken);
    const token = TokenService.generateAccessToken(payload);
    const cookieOptions = buildCookieOptions();

    res.cookie("access_token", token, {
        ...cookieOptions
    });

    return res.status(200).json({ token });
}

export async function logout(req: Request, res: Response) {
    const cookieOptions = buildCookieOptions();

    res.clearCookie("access_token", cookieOptions);
    res.clearCookie("refresh_token", {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return res.status(204).send();
}
