const mongoose = require('mongoose');

const collabRequestSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromName: { type: String, required: true },
  fromAvatar: { type: String, default: '' },
  fromRole: { type: String, enum: ['brand', 'influencer'], required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toName: { type: String, required: true },
  campaignName: { type: String, required: true },
  message: { type: String, default: '' },
  budget: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CollabRequest', collabRequestSchema);
