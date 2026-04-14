const mongoose = require('mongoose');

// This schema stores pre-computed analytics (simulating Spark pipeline output)
// In future: populated by Spark pipeline writing to MongoDB
const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  // YouTube Analytics
  ytOverview: {
    totalViews: { type: Number, default: 0 },
    subscribers: { type: Number, default: 0 },
    avgWatchTime: { type: String, default: '0:00' },
    totalVideos: { type: Number, default: 0 },
  },
  ytMonthlyViews: [{ month: String, views: Number }],
  ytRecentVideos: [{
    videoId: String,
    title: String,
    views: Number,
    likes: Number,
    comments: Number,
    ctr: Number,
    avgViewDuration: String,
    retention: Number,
    date: String,
  }],
  ytDemographics: [{ age: String, percent: Number }],
  ytGenderSplit: [{ gender: String, percent: Number }],
  ytTopCountries: [{ country: String, percent: Number }],
  ytDeviceUsage: [{ device: String, percent: Number }],
  // Instagram Analytics
  instaOverview: {
    followers: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    profileVisits: { type: Number, default: 0 },
  },
  instaRecentPosts: [{
    type: { type: String },
    caption: String,
    likes: Number,
    comments: Number,
    shares: Number,
    saves: Number,
    reach: Number,
    date: String,
  }],
  instaWeeklyReach: [{ week: String, reach: Number }],
  instaEngagementByType: [{ type: { type: String }, rate: Number }],
  // Posting patterns
  postingWeeklyPosts: [{ week: String, posts: Number }],
  postingBestTimes: [{ time: String, engagement: Number }],
  postingBestDays: [{ day: String, engagement: Number }],
  // Revenue
  totalEarnings: { type: String, default: '₹0' },
  monthlyEarnings: [{ month: String, earnings: Number }],
  earningsByBrand: [{ brand: String, amount: Number }],
  pendingPayments: { type: String, default: '₹0' },
  completedPayments: { type: String, default: '₹0' },
  // Platform comparison
  platformComparison: [{
    platform: String,
    followers: Number,
    engagement: Number,
    growth: Number,
    content: Number,
  }],
  // Health score
  healthScore: { type: Number, default: 0 },
  healthBreakdown: {
    engagement: { weight: Number, score: Number },
    growth: { weight: Number, score: Number },
    audienceQuality: { weight: Number, score: Number },
    campaignSuccess: { weight: Number, score: Number },
  },
  // Brand analytics (if user is brand)
  brandOverview: {
    totalCampaigns: { type: Number, default: 0 },
    activeCampaigns: { type: Number, default: 0 },
    completedCampaigns: { type: Number, default: 0 },
    totalSpending: { type: String, default: '₹0' },
    avgCampaignROI: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
  },
  brandSpendingTrend: [{ month: String, spending: Number }],
  brandCampaignPerformance: [{ campaign: String, engagement: Number, roi: Number, reach: Number }],
  brandInfluencerComparison: [{ name: String, engagement: Number, roi: Number, campaigns: Number }],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analytics', analyticsSchema);
