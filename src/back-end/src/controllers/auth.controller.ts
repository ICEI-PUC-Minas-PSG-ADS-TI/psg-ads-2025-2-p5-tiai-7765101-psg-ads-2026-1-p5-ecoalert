import { AuthService } from "@/services/auth.service";
import { Request, Response } from "express";

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    const response = await AuthService.login(email, password);

    const { token, refreshToken, user } = response;
    const isProduction = process.env.NODE_ENV === "production";
    const sameSite = isProduction ? "none" : "lax";

    res.cookie("access_token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite,
        maxAge: 1000 * 60 * 60 * 24
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite,
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return res.status(200).json({user, token});
}
