import express from "express";
import { protect } from "../middleware/authMiddleware";
import {getMessages} from '../controllers/messageController';

const router = express.Router();

router.get("/:communityId", getMessages);

export default router;
