import { login, logout, refresh } from "@/controllers/auth.controller";
import { errorHandler } from "@/utils/errorHandler";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/login", errorHandler(login));
authRoutes.post("/refresh", errorHandler(refresh));
authRoutes.post("/logout", errorHandler(logout));

export { authRoutes };