import { AuthService } from "@/services/auth.service";
import { Request, Response } from "express";

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    const response = await AuthService.login(email, password);

    const { token, refreshToken, user } = response;

    res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return res.status(200).json(user);
}