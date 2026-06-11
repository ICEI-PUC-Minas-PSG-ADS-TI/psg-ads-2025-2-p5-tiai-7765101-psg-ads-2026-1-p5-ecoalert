import { getUserById, getUsers, me } from "@/controllers/user.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { errorHandler } from "@/utils/errorHandler";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", errorHandler(getUsers));
userRoutes.get("/me", authMiddleware, errorHandler(me));
userRoutes.get("/:id", errorHandler(getUserById));

export { userRoutes };
