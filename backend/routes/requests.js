const express = require('express');
const { auth } = require('../middleware/auth');
const CollabRequest = require('../models/CollabRequest');
const Notification = require('../models/Notification');
const Thread = require('../models/Thread');
const User = require('../models/User');
const InfluencerProfile = require('../models/InfluencerProfile');
const BrandProfile = require('../models/BrandProfile');

const router = express.Router();

// POST /api/requests — send a collaboration request (brand → influencer)
router.post('/', auth, async (req, res) => {
  try {
    const { toUserId, campaignName, message, budget } = req.body;

    if (!toUserId || !campaignName) {
      return res.status(400).json({ message: 'toUserId and campaignName are required' });
    }

    if (toUserId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot send a collaboration request to yourself' });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ message: 'Recipient not found' });

    // Get sender profile name
    let fromName = req.user.name;
    let fromAvatar = req.user.avatar || '';
    let fromCategories = [];
    if (req.user.role === 'brand') {
      const bp = await BrandProfile.findOne({ userId: req.user._id });
      if (bp) { fromName = bp.name; fromAvatar = bp.logo || fromAvatar; }
    } else {
      const ip = await InfluencerProfile.findOne({ userId: req.user._id });
      if (ip) { 
        fromName = ip.name; 
        fromAvatar = ip.avatar || fromAvatar; 
        fromCategories = ip.categories || [];
      }
    }

    const request = new CollabRequest({
      fromUserId: req.user._id,
      fromName,
      fromAvatar,
      fromRole: req.user.role,
      toUserId,
      toName: toUser.name,
      campaignName,
      message: message || '',
      budget: budget || '',
      categories: fromCategories,
      status: 'pending',
    });
    await request.save();

    // Create notification for recipient
    const isPitch = req.user.role === 'influencer';
    const notification = new Notification({
      userId: toUserId,
      type: isPitch ? 'pitch' : 'collab_request',
      title: isPitch ? 'New Collaboration Pitch' : 'New Collaboration Request',
      description: isPitch 
        ? `${fromName} pitched a proposal for "${campaignName}"` 
        : `${fromName} wants to collaborate: "${campaignName}"`,
      fromUserId: req.user._id,
      fromName,
      fromAvatar,
      relatedId: request._id.toString(),
      read: false,
    });
    await notification.save();

    // Emit via Socket.IO
    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');
    const recipientSocketId = onlineUsers.get(toUserId.toString());
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('new_notification', notification);
    }

    res.status(201).json({ request, notification });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/requests — get requests for current user
router.get('/', auth, async (req, res) => {
  try {
    const { type } = req.query; // 'sent' | 'received'
    let query = {};
    if (type === 'sent') query.fromUserId = req.user._id;
    else if (type === 'received') query.toUserId = req.user._id;
    else query = { $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }] };

    const requests = await CollabRequest.find(query).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/requests/:id/accept — accept request → create chat thread
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const request = await CollabRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.toUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    // Get profiles for thread
    const fromUser = await User.findById(request.fromUserId);
    const toUser = await User.findById(request.toUserId);

    let fromAvatar = fromUser?.avatar || '';
    let toAvatar = toUser?.avatar || '';

    if (fromUser?.role === 'brand') {
      const bp = await BrandProfile.findOne({ userId: fromUser._id });
      if (bp) fromAvatar = bp.avatar || bp.logo || fromAvatar;
    } else {
      const ip = await InfluencerProfile.findOne({ userId: fromUser._id });
      if (ip) fromAvatar = ip.avatar || fromAvatar;
    }
    if (toUser?.role === 'brand') {
      const bp = await BrandProfile.findOne({ userId: toUser._id });
      if (bp) toAvatar = bp.avatar || bp.logo || toAvatar;
    } else {
      const ip = await InfluencerProfile.findOne({ userId: toUser._id });
      if (ip) toAvatar = ip.avatar || toAvatar;
    }

    // Create thread
    const thread = new Thread({
      participants: [request.fromUserId, request.toUserId],
      participantNames: [request.fromName, request.toName],
      participantAvatars: [fromAvatar, toAvatar],
      collabRequestId: request._id,
      campaignName: request.campaignName,
      unreadCount: {
        [request.fromUserId.toString()]: 0,
        [request.toUserId.toString()]: 0,
      },
    });
    await thread.save();

    // Update request
    request.status = 'accepted';
    request.threadId = thread._id;
    request.updatedAt = new Date();
    await request.save();

    // Notify sender that request was accepted
    const notification = new Notification({
      userId: request.fromUserId,
      type: 'request_accepted',
      title: 'Collaboration Request Accepted!',
      description: `${request.toName} accepted your request for "${request.campaignName}". You can now chat!`,
      fromUserId: req.user._id,
      fromName: request.toName,
      fromAvatar: toAvatar,
      relatedId: thread._id.toString(),
      read: false,
    });
    await notification.save();

    // Emit via Socket.IO
    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');
    const senderSocketId = onlineUsers.get(request.fromUserId.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit('new_notification', notification);
      io.to(senderSocketId).emit('chat_unlocked', { threadId: thread._id, thread });
    }

    res.json({ request, thread });
  } catch (err) {
    console.error('Accept request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/requests/:id/decline
router.put('/:id/decline', auth, async (req, res) => {
  try {
    const request = await CollabRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.toUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    request.status = 'declined';
    request.updatedAt = new Date();
    await request.save();

    const notification = new Notification({
      userId: request.fromUserId,
      type: 'request_declined',
      title: 'Collaboration Request Declined',
      description: `${request.toName} declined your request for "${request.campaignName}"`,
      fromUserId: req.user._id,
      fromName: request.toName,
      relatedId: request._id.toString(),
      read: false,
    });
    await notification.save();

    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');
    const senderSocketId = onlineUsers.get(request.fromUserId.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit('new_notification', notification);
    }

    res.json({ request });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
