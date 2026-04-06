import { createCommunity, updateCommunity, deleteCommunity } from "@/controllers/community.controller";
import { authorize } from "@/middlewares/authorization.middleware";
import { errorHandler } from "@/utils/errorHandler";

import { Router } from "express";

const communityRoutes = Router();

communityRoutes.post("/", authorize(["ADMIN"]), errorHandler(createCommunity));
communityRoutes.put("/:id", errorHandler(updateCommunity));
communityRoutes.delete("/:id", errorHandler(deleteCommunity));

export { communityRoutes };