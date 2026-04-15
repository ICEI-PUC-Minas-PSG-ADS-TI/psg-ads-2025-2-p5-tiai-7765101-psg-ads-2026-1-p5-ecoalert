import { User } from "@/models/user.model";
import { UserService } from "@/services/user.service";
import { AuthRequest } from "@/types/http";
import { Request, Response } from "express";

type Params = {
    id: string
}

export async function getUsers(req: AuthRequest, res: Response) {
    return res.json(await UserService.findAll());
}

export async function createUser(req: Request, res: Response) {
    console.log("Received request to create user with body:", req.body);
    const response: Omit<User, "password"> = await UserService.create(req.body);
    return res.status(201).json(response);
}

export async function getUserById(req: Request<Params>, res: Response) {
    const { id } = req.params;
    return res.json(await UserService.findById(id));
}