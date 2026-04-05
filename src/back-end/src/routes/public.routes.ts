import { createUser } from "@/controllers/user.controller";
import { errorHandler } from "@/utils/errorHandler";
import { Router } from "express";
import { authRoutes } from "./auth.routes";

const publicRoutes = Router();

publicRoutes.use('/auth', authRoutes);

publicRoutes.post('/users', errorHandler(createUser))

export { publicRoutes };