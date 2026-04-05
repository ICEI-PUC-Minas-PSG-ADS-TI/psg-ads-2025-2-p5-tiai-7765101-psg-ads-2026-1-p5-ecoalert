import { User } from "@/models/user.model";
import { UserService } from "@/services/user.service";
import { Request, Response } from "express";

const service = new UserService();

export async function getUsers(req: Request, res: Response) {
    return res.json({ message: "Hello Users!" });
}

export async function createUser(req: Request, res: Response) {
    try {
        const response: Omit<User, "password"> = await service.create(req.body);
        return res.json(response);
    } catch (error) {
        console.log(error);
        return res.json({ message: 'Erro ao criar usuário' });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const {email, password} = req.body;
        
        const user = await service.login(email, password);
        return res.json({message: "Login bem sucedido", user});

    } catch(error) {
        console.log(error);
        return res.json({ message: 'Erro ao fazer login' });
    }
}