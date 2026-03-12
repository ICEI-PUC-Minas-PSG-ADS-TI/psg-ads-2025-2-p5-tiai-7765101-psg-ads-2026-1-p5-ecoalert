import { User } from "@/models/user.model";
import { UserService } from "@/services/user.service";
import { Request, Response } from "express";

export async function getUsers(req: Request, res: Response) {
    return res.json({ message: "Hello Users!" });
}

export async function createUser(req: Request, res: Response) {
    try {
        const response: Omit<User, "password"> = await UserService.create(req.body);
        return res.json(response);
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Erro ao criar usuário' });
    }
}