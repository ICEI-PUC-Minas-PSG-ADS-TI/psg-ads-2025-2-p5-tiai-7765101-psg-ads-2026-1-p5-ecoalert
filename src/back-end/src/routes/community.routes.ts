import { createCommunity,getCommunities,getCommunityById,updateCommunity,deleteCommunity
} from "@/controllers/community.controller";

import { Router } from "express";

const communityRoutes = Router();

communityRoutes.get("/", getCommunities);
communityRoutes.get("/:id", getCommunityById);
communityRoutes.post("/", createCommunity);
communityRoutes.put("/:id", updateCommunity);
communityRoutes.delete("/:id", deleteCommunity);

export { communityRoutes };