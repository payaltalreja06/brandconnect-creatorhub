const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const platformStatsSchema = new mongoose.Schema({
  platform: String,
  followers: Number,
  engagement: Number,
  growth: Number,
  content: Number,
});

const influencerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  handle: { type: String, required: true },
  avatar: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  domain: [{ type: String }],
  platforms: [{ type: String }],
  rate: { type: String, default: '' },
  price: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  engagement: { type: Number, default: 0 },
  ytSubscribers: { type: Number, default: 0 },
  instaFollowers: { type: Number, default: 0 },
  healthScore: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  contentType: [{ type: String }],
  gender: { type: String, default: '' },
  age: { type: String, default: '' },
  language: { type: String, default: 'English' },
  badges: [{ type: String }],
  faqs: [faqSchema],
  platformStats: [platformStatsSchema],
  website: { type: String, default: '' },
  instagram: { type: String, default: '' },
  youtube: { type: String, default: '' },
  tiktok: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
});

influencerProfileSchema.pre('save', function() {
  this.updatedAt = new Date();
});

module.exports = mongoose.model('InfluencerProfile', influencerProfileSchema);
