// index.ts

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import setupSocket from "./socket/socket";
import connectDB from './config/db';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import userRoutes from './routes/userRoutes';
import communityRoutes from './routes/communityRoutes';
import messageRoutes from './routes/messageRoutes';
import predictRoutes from './routes/predictRoutes';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 3000;

// connect to socket.io
setupSocket(io);

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes middleware
app.use('/api/users', userRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/communities/messages', messageRoutes);
app.use('/api/recommendation', predictRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('AgriSmart Server Running!');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Node.js server running at http://localhost:${PORT}`);
});