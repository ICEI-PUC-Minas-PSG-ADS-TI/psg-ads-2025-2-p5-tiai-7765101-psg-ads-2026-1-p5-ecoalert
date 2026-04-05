import { login } from "@/controllers/auth.controller";
import { errorHandler } from "@/utils/errorHandler";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/login", errorHandler(login));

export { authRoutes };