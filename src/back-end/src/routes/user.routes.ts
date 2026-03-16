import { getUserById, getUsers } from "@/controllers/user.controller";
import { errorHandler } from "@/utils/errorHandler";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", errorHandler(getUsers));
userRoutes.get("/:id", errorHandler(getUserById));

export { userRoutes };