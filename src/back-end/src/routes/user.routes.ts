import { getUserById, getUsers, me, updateMe } from "@/controllers/user.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { errorHandler } from "@/utils/errorHandler";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", errorHandler(getUsers));
userRoutes.get("/me", authMiddleware, errorHandler(me));
userRoutes.patch("/me", authMiddleware, errorHandler(updateMe));
userRoutes.get("/:id", errorHandler(getUserById));

export { userRoutes };
