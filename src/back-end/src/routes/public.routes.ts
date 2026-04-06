import { createUser } from "@/controllers/user.controller";
import { errorHandler } from "@/utils/errorHandler";
import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { getCommunities, getCommunityById } from "@/controllers/community.controller";

const publicRoutes = Router();

publicRoutes.use('/auth', authRoutes);

publicRoutes.post('/users', errorHandler(createUser))

publicRoutes.get('/communities', errorHandler(getCommunities));
publicRoutes.get('/communities/:id', errorHandler(getCommunityById));

export { publicRoutes };