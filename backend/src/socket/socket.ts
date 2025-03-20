import { Server } from "socket.io";
import Message from "../models/messageModel";
import mongoose from "mongoose";

const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinCommunity", (communityId) => {
      socket.join(communityId);
      console.log(`User joined community: ${communityId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { sender, community, content } = data;

        // Validate sender and community
        if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(community)) {
          console.error("Invalid ObjectId format for sender or community.");
          return;
        }

        const newMessage = new Message({
          sender: new mongoose.Types.ObjectId(sender), // Ensure it's an ObjectId
          community: new mongoose.Types.ObjectId(community),
          content,
        });

        await newMessage.save();

        const fullMessage = await Message.findById(newMessage._id).populate("sender", "name");

        io.to(community).emit("receiveMessage", fullMessage);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    socket.on("leaveCommunity", (communityId) => {
      socket.leave(communityId);
      console.log(`User left community: ${communityId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default setupSocket;
