import mongoose from "mongoose";
import {IMessage} from "../types";

const MessageSchema = new mongoose.Schema<IMessage>({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  community: { type: mongoose.Schema.Types.ObjectId, ref: "Community", required: true }, 
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
