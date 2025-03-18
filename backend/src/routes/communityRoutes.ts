import express from "express";
import { protect } from "../middleware/authMiddleware";
import { getCommunities, createCommunity, joinCommunity } from "../controllers/communityController";

const router = express.Router();

router.route("/").get(protect, getCommunities);
router.route("/create").post(protect, createCommunity);
router.route("/join").post(protect, joinCommunity);

export default router;