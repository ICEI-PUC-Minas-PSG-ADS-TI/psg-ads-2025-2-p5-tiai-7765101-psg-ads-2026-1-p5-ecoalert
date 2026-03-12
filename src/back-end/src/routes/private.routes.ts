import { Router } from "express";
import { userRoutes } from "./user.routes";
import { authMiddleware } from "@/middlewares/auth.middleware";

const privateRoutes = Router();

privateRoutes.use(authMiddleware);

privateRoutes.use('/users', userRoutes);

export { privateRoutes };