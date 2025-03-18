import Community from "../models/communityModel";
import User from "../models/userModel";
import asyncHandler from "express-async-handler";
import { Request } from "express";

const getCommunities = asyncHandler(async (req, res) => {
    const users = await Community.find();
    res.json(users);
});

const createCommunity = asyncHandler(async (req:Request, res:any) => {
    const { name, description, userId } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const community = new Community({ name, description, members: [userId] });
      await community.save();
  
      res.status(201).json({ message: 'Community created successfully', community });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create community' });
    }
})

const joinCommunity = asyncHandler(async (req:Request, res:any) => {
  const { communityId, userId } = req.body;

  try {
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ error: 'Community not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!community.members.includes(userId)) {
      community.members.push(userId);
      await community.save();
    }

    res.status(200).json({ message: 'Joined community successfully', community });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to join community' });
  }
})

export {getCommunities, createCommunity, joinCommunity};