import { createUser, getUsers } from "@/controllers/user.controller";
import { errorHandler } from "@/utils/errorHandler";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", errorHandler(getUsers));
userRoutes.post("/", errorHandler(createUser));

export { userRoutes };