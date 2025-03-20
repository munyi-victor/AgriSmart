import mongoose, { Schema, Document } from "mongoose";
import {ICommunity} from '../types';

const CommunitySchema = new Schema<ICommunity>({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

const Community = mongoose.model<ICommunity>("Community", CommunitySchema);
export default Community;
