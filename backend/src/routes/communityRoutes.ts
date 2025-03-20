import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createCommunity, joinCommunity, leaveCommunity, getCommunityInfo, getCommunities } from "../controllers/communityController";

const router = express.Router();

router.get("/", protect, getCommunities);
router.post("/create", protect, createCommunity);
router.post("/join", protect, joinCommunity);
router.post("/leave", protect, leaveCommunity);
router.get("/:communityId", protect, getCommunityInfo);

export default router;
