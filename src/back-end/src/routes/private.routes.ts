import { Router } from "express";
import { userRoutes } from "./user.routes";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { errorHandler } from "@/utils/errorHandler";
import { communityRoutes } from "./community.routes";

const privateRoutes = Router();

privateRoutes.use(authMiddleware);

privateRoutes.use('/users', userRoutes);
privateRoutes.use('/communities', errorHandler(communityRoutes));

export { privateRoutes };