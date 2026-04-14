const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const influencerRoutes = require('./routes/influencer');
const brandRoutes = require('./routes/brand');
const requestRoutes = require('./routes/requests');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const campaignRoutes = require('./routes/campaigns');
const analyticsRoutes = require('./routes/analytics');
const uploadRoutes = require('./routes/upload');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:8081'
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Root Route & Security Headers
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self' data: https://collabrix-api.onrender.com; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Collabrix API is Live!', 
    frontend: process.env.FRONTEND_URL || 'Not Configured',
    timestamp: new Date()
  });
});

// Serve uploads as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/spark-pipeline', express.static(path.join(__dirname, '../spark-pipeline')));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/influencers', influencerRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// Socket.IO — Real-time chat
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    socket.join(`user:${userId}`);
    io.emit('user_online', userId);
  });

  socket.on('join_thread', (threadId) => {
    socket.join(`thread:${threadId}`);
  });

  socket.on('leave_thread', (threadId) => {
    socket.leave(`thread:${threadId}`);
  });

  socket.on('send_message', async (data) => {
    socket.to(`thread:${data.threadId}`).emit('new_message', data.message);
    const recipientSocketId = onlineUsers.get(data.recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('message_delivered', {
        threadId: data.threadId,
        messageId: data.message._id,
      });
    }
  });

  socket.on('message_seen', (data) => {
    socket.to(`user:${data.senderId}`).emit('message_seen', {
      threadId: data.threadId,
      messageId: data.messageId,
    });
  });

  socket.on('typing', (data) => {
    socket.to(`thread:${data.threadId}`).emit('typing', {
      userId: socket.userId,
      threadId: data.threadId,
    });
  });

  socket.on('stop_typing', (data) => {
    socket.to(`thread:${data.threadId}`).emit('stop_typing', {
      userId: socket.userId,
      threadId: data.threadId,
    });
  });

  socket.on('collab_request_sent', (data) => {
    const recipientSocketId = onlineUsers.get(data.recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('new_notification', data.notification);
    }
  });

  socket.on('collab_request_accepted', (data) => {
    const recipientSocketId = onlineUsers.get(data.recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('new_notification', data.notification);
      io.to(recipientSocketId).emit('chat_unlocked', { threadId: data.threadId });
    }
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('user_offline', socket.userId);
    }
  });
});

// Make io accessible in routes
app.set('io', io);
app.set('onlineUsers', onlineUsers);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = { app, io };
