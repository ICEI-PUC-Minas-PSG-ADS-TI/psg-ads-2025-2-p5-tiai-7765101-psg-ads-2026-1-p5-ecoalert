import { Request, Response } from "express";

export async function getUsers(req: Request, res: Response) {
    return res.json({ message: "Hello Users!" });
}