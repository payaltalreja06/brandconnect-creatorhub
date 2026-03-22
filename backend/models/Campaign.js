const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brandName: { type: String, required: true },
  brandLogo: { type: String, default: '🏢' },
  influencerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  influencerName: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  deliverables: [{ type: String }],
  budget: { type: String, default: '' },
  deadline: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  engagement: { type: Number, default: 0 },
  roi: { type: Number, default: 0 },
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Campaign', campaignSchema);
