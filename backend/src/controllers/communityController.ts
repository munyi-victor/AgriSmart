import { Response } from "express";
import Community from "../models/communityModel";
import User from "../models/userModel";

export const getCommunities = async (req :any, res:any) => {
    try {
        const communities = await Community.find();

        if (!communities) return res.status(404).json({error: "No communities found"});
        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({error: "Error fetching communities"});
    }
}

export const createCommunity = async (req: any, res: any) => {
    try {
        const { name, description } = req.body;
        const adminId = req.user._id;
        const community = await Community.create({ name, description, admin: adminId, members: [adminId] });
        res.status(201).json(community);
    } catch (error) {
        res.status(500).json({ error: "Error creating community" });
    }
};

export const joinCommunity = async (req: any, res: any) => {
    try {
        const { communityId } = req.body;
        const userId = req.user._id;
        const community = await Community.findById(communityId);
        if (!community) return res.status(404).json({ error: "Community not found" });

        if (!community.members.includes(userId)) {
            community.members.push(userId);
            await community.save();
        }
        res.status(200).json({ message: "Joined community" });
    } catch (error) {
        res.status(500).json({ error: "Error joining community" });
    }
};

export const leaveCommunity = async (req: any, res: any) => {
    try {
        const { userId, communityId } = req.body;
        const community = await Community.findById(communityId);
        if (!community) return res.status(404).json({ error: "Community not found" });

        community.members = community.members.filter((member) => member.toString() !== userId);
        await community.save();
        res.status(200).json({ message: "Left community" });
    } catch (error) {
        res.status(500).json({ error: "Error leaving community" });
    }
};

export const getCommunityInfo = async (req: any, res: any) => {
    try {
        const { communityId } = req.params;
        const community = await Community.findById(communityId).populate("members", "name");
        if (!community) return res.status(404).json({ error: "Community not found" });

        res.status(200).json(community);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving community info" });
    }
};
