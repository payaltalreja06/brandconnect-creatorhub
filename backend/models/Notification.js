const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['collab_request', 'pitch', 'request_accepted', 'request_declined', 'new_message', 'payment', 'campaign', 'system'],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  fromName: { type: String, default: '' },
  fromAvatar: { type: String, default: '' },
  relatedId: { type: String, default: null }, // collabRequestId, threadId, etc.
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Notification', notificationSchema);
