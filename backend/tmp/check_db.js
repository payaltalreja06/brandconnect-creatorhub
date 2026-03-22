const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../models/User');
const Analytics = require('../models/Analytics');

async function checkAnalytics() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const vigorUser = await User.findOne({ name: 'Vigor Fitness' });
    if (!vigorUser) { console.log('Vigor Fitness user not found'); process.exit(0); }
    
    const ana = await Analytics.findOne({ userId: vigorUser._id });
    if (!ana) { console.log('Analytics for Vigor not found'); process.exit(0); }
    
    console.log(`Vigor User ID: ${vigorUser._id}`);
    console.log(`Vigor Analytics Overview:`, ana.brandOverview);
    console.log(`Vigor Spending Trend Count: ${ana.brandSpendingTrend ? ana.brandSpendingTrend.length : 0}`);
    console.log(`Vigor Campaign Performance Count: ${ana.brandCampaignPerformance ? ana.brandCampaignPerformance.length : 0}`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkAnalytics();
