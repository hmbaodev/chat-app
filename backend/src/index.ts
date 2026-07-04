import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import './config/firebase'; // Ensure Firebase initializes
import { getAuth } from 'firebase-admin/auth';
import { Message } from './models/Message';
import { Conversation } from './models/Conversation';
import { User } from './models/User';

import userRoutes from './routes/user.routes';
import conversationRoutes from './routes/conversation.routes';
import messageRoutes from './routes/message.routes';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running smoothly!' });
});

// Socket.io Setup
// Middleware to authenticate socket connections
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) throw new Error('Authentication error: No token provided');
    
    const decodedToken = await getAuth().verifyIdToken(token);
    socket.data.uid = decodedToken.uid;
    
    // Set user as online
    await User.findOneAndUpdate(
      { firebaseUid: decodedToken.uid },
      { $set: { isOnline: true } },
      { upsert: true }
    );
    
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  socket.on('join_chat', (conversationId: string) => {
    socket.join(conversationId);
  });

  socket.on('send_message', async (data: { conversationId: string, text: string }) => {
    try {
      const senderId = socket.data.uid;
      
      const newMessage = new Message({
        conversationId: data.conversationId,
        senderId,
        text: data.text,
        readBy: [senderId]
      });
      await newMessage.save();

      await Conversation.findByIdAndUpdate(data.conversationId, {
        lastMessage: newMessage._id
      });

      // Broadcast to everyone in the room
      io.to(data.conversationId).emit('receive_message', newMessage);
    } catch (error) {
      console.error('Error sending socket message:', error);
    }
  });

  socket.on('disconnect', async () => {
    try {
      await User.findOneAndUpdate(
        { firebaseUid: socket.data.uid },
        { $set: { isOnline: false, lastSeen: new Date() } }
      );
    } catch (error) {
      console.error('Error updating disconnect status:', error);
    }
  });
});

const PORT = process.env.PORT;
 
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); 
  });
});
