// index.ts

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io'; // Correct import for TypeScript
import connectDB from './config/db';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import userRoutes from './routes/userRoutes';
import communityRoutes from './routes/communityRoutes';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8081', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  },
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes middleware
app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Real-time chat with Socket.IO
io.on('connection', (socket:any) => {
  console.log('A user connected:', socket.id);

  // Join a room (community)
  socket.on('joinRoom', (communityId: string) => {
    socket.join(communityId);
    console.log(`User ${socket.id} joined room ${communityId}`);
  });

  // Send a message to a room
  socket.on(
    'sendMessage',
    ({ communityId, message, sender }: { communityId: string; message: string; sender: string }) => {
      io.to(communityId).emit('receiveMessage', { message, sender });
    }
  );

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('AgriSmart Server Running!');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Node.js server running at http://localhost:${PORT}`);
});