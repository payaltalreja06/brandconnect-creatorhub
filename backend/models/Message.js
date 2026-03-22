const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderAvatar: { type: String, default: '' },
  text: { type: String, default: '' },
  type: {
    type: String,
    enum: ['text', 'campaign_start', 'payment_init', 'system'],
    default: 'text',
  },
  metadata: { type: mongoose.Schema.Types.Mixed, default: null },
  // WhatsApp-style delivery status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'seen'],
    default: 'sent',
  },
  seenAt: { type: Date, default: null },
  deliveredAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
