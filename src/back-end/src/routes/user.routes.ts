import { createUser, getUsers, login } from "@/controllers/user.controller";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", getUsers);
userRoutes.post("/", createUser);
userRoutes.post("/login", login);
 
export { userRoutes };