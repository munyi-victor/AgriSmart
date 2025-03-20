import express from "express";
import Message from "../models/messageModel";

const router = express.Router();

// Get all messages for a specific community
export const getMessages =  async (req:any, res:any) => {
  try {
    const { communityId } = req.params;

    const messages = await Message.find({ community: communityId })
      .populate("sender", "name") 
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default router;
