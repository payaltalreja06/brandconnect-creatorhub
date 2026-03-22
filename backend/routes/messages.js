const express = require('express');
const { auth } = require('../middleware/auth');
const Message = require('../models/Message');
const Thread = require('../models/Thread');

const router = express.Router();

// GET /api/messages/threads — get all threads for current user
router.get('/threads', auth, async (req, res) => {
  try {
    const threads = await Thread.find({
      participants: req.user._id,
      isActive: true,
    }).sort({ lastMessageAt: -1 });
    res.json(threads);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages/threads/:threadId/messages — get messages in a thread
router.get('/threads/:threadId/messages', auth, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });
    if (!thread.participants.includes(req.user._id.toString())) {
      return res.status(403).json({ message: 'Not a participant' });
    }

    const messages = await Message.find({ threadId: req.params.threadId })
      .sort({ createdAt: 1 });

    // Mark undelivered messages as delivered for the recipient
    await Message.updateMany(
      {
        threadId: req.params.threadId,
        senderId: { $ne: req.user._id },
        status: 'sent',
      },
      { $set: { status: 'delivered', deliveredAt: new Date() } }
    );

    // Reset unread count for current user
    const uid = req.user._id.toString();
    thread.unreadCount.set(uid, 0);
    await thread.save();

    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/messages/threads/:threadId/messages — send a message
router.post('/threads/:threadId/messages', auth, async (req, res) => {
  try {
    const { text, type, metadata } = req.body;
    const thread = await Thread.findById(req.params.threadId);
    if (!thread) return res.status(404).json({ message: 'Thread not found' });

    const isParticipant = thread.participants.map(p => p.toString()).includes(req.user._id.toString());
    if (!isParticipant) return res.status(403).json({ message: 'Not a participant' });

    const message = new Message({
      threadId: thread._id,
      senderId: req.user._id,
      senderName: req.user.name,
      senderAvatar: req.user.avatar || '',
      text: text || '',
      type: type || 'text',
      metadata: metadata || null,
      status: 'sent',
    });
    await message.save();

    // Update thread last message
    thread.lastMessage = text || (type === 'campaign_start' ? '🚀 Campaign Started' : type === 'payment_init' ? '💳 Payment Initiated' : '');
    thread.lastMessageAt = new Date();
    thread.lastMessageSenderId = req.user._id;

    // Increment unread count for other participants
    thread.participants.forEach(pid => {
      const pidStr = pid.toString();
      if (pidStr !== req.user._id.toString()) {
        const current = thread.unreadCount.get(pidStr) || 0;
        thread.unreadCount.set(pidStr, current + 1);
      }
    });
    await thread.save();

    // Find the other participant for socket emit
    const recipientId = thread.participants.find(p => p.toString() !== req.user._id.toString());

    // Emit via Socket.IO
    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');
    io.to(`thread:${thread._id}`).emit('new_message', message);

    // Mark as delivered if recipient is in the thread room
    const recipientSocketId = onlineUsers.get(recipientId?.toString());
    if (recipientSocketId) {
      await Message.findByIdAndUpdate(message._id, { status: 'delivered', deliveredAt: new Date() });
      message.status = 'delivered';
      io.to(`thread:${thread._id}`).emit('message_status_update', {
        messageId: message._id,
        status: 'delivered',
      });
    }

    res.status(201).json(message);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/messages/:messageId/seen — mark message as seen
router.put('/:messageId/seen', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (message.senderId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot mark own message as seen' });
    }

    message.status = 'seen';
    message.seenAt = new Date();
    await message.save();

    // Notify sender
    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');
    const senderSocketId = onlineUsers.get(message.senderId.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit('message_seen', {
        messageId: message._id,
        threadId: message.threadId,
        seenAt: message.seenAt,
      });
    }
    io.to(`thread:${message.threadId}`).emit('message_status_update', {
      messageId: message._id,
      status: 'seen',
    });

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/messages/threads/:threadId/seen-all
router.put('/threads/:threadId/seen-all', auth, async (req, res) => {
  try {
    const result = await Message.updateMany(
      {
        threadId: req.params.threadId,
        senderId: { $ne: req.user._id },
        status: { $in: ['sent', 'delivered'] },
      },
      { $set: { status: 'seen', seenAt: new Date() } }
    );

    const thread = await Thread.findById(req.params.threadId);
    if (thread) {
      thread.unreadCount.set(req.user._id.toString(), 0);
      await thread.save();
    }

    // Notify thread participants
    const io = req.app.get('io');
    io.to(`thread:${req.params.threadId}`).emit('all_seen', {
      threadId: req.params.threadId,
      seenBy: req.user._id,
    });

    res.json({ updated: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
