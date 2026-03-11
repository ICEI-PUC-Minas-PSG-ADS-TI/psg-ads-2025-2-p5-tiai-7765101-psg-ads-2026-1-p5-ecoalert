import { getUsers } from "@/controllers/user.controller";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", getUsers);

export { userRoutes };