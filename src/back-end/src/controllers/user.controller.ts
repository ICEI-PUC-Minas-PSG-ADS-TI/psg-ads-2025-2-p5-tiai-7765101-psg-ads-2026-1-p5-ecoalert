import { User } from "@/models/user.model";
import { UserService } from "@/services/user.service";
import { AuthRequest } from "@/types/http";
import { Request, Response } from "express";

export async function getUsers(req: AuthRequest, res: Response) {
    return res.json(await UserService.findAll());
}

export async function createUser(req: Request, res: Response) {
    const response: Omit<User, "password"> = await UserService.create(req.body);
    return res.json(response);
}