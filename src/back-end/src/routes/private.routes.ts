import { Router } from "express";
import { userRoutes } from "./user.routes";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { errorHandler } from "@/utils/errorHandler";
import { communityRoutes } from "./community.routes";
import { weatherRoutes } from "./weather.routes";
import { sensorRoutes } from "./sensor.routes";

const privateRoutes = Router();

privateRoutes.use(authMiddleware);

privateRoutes.use('/users', errorHandler(userRoutes));
privateRoutes.use('/communities', errorHandler(communityRoutes));
privateRoutes.use('/weather', errorHandler(weatherRoutes));
privateRoutes.use('/sensors', errorHandler(sensorRoutes));

export { privateRoutes };
