const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  participantNames: [{ type: String }],
  participantAvatars: [{ type: String }],
  collabRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'CollabRequest', default: null },
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now },
  lastMessageSenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  unreadCount: { type: Map, of: Number, default: {} },
  isActive: { type: Boolean, default: true },
  campaignName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Thread', threadSchema);
