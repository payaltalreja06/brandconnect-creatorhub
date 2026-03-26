const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InfluencerProfile = require('../models/InfluencerProfile');
const BrandProfile = require('../models/BrandProfile');
const Analytics = require('../models/Analytics');

const router = express.Router();

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    email = email.toLowerCase();

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!['influencer', 'brand'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
    const user = new User({ name, email, password, role, avatar });
    await user.save();

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Create profile and analytics based on role
    if (role === 'influencer') {
      const handle = '@' + name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 999);
      const profile = new InfluencerProfile({
        userId: user._id,
        name,
        handle,
        avatar,
        bio: '',
        location: '',
        domain: [],
        platforms: [],
        rate: '',
        faqs: [],
      });
      await profile.save();

      const analytics = new Analytics({
        userId: user._id,
        ytOverview: { totalViews: 0, subscribers: 0, avgWatchTime: '0:00', totalVideos: 0 },
        ytMonthlyViews: [],
        ytDemographics: [
            { age: "18-24", percent: 35 },
            { age: "25-34", percent: 45 },
            { age: "35-44", percent: 15 },
            { age: "45+", percent: 5 }
        ],
        ytGenderSplit: [
            { gender: "Male", percent: 48 },
            { gender: "Female", percent: 52 }
        ],
        instaOverview: { followers: 800, reach: 2500, impressions: 5000, profileVisits: 120 },
        instaEngagementByType: [
            { type: "Reels", rate: 5.2 },
            { type: "Posts", rate: 3.8 },
            { type: "Stories", rate: 8.4 }
        ],
        healthScore: 82,
        totalEarnings: '₹12,400',
        monthlyEarnings: months.map(m => ({ month: m, earnings: Math.floor(Math.random() * 2000 + 500) })),
        platformComparison: [
            { platform: "YouTube", followers: 1200, engagement: 4.5, growth: 10 },
            { platform: "Instagram", followers: 800, engagement: 3.8, growth: 15 }
        ],
      });
      await analytics.save();
    } else {
      const profile = new BrandProfile({
        userId: user._id,
        name,
        domain: '',
        description: '',
        faqs: [],
      });
      await profile.save();

      const analytics = new Analytics({
        userId: user._id,
        brandOverview: {
          totalCampaigns: 5,
          activeCampaigns: 2,
          completedCampaigns: 3,
          totalSpending: '₹1,50,000',
          avgCampaignROI: 3.8,
          successRate: 90,
        },
        brandSpendingTrend: months.map(m => ({ month: m, spending: Math.floor(Math.random() * 30000 + 5000) })),
        brandCampaignPerformance: [
          { campaign: "Initial Drive", engagement: 4.1, roi: 3.2, reach: 150000 },
          { campaign: "Referral Program", engagement: 3.5, roi: 2.8, reach: 80000 }
        ],
        brandInfluencerComparison: [],
      });
      await analytics.save();
    }

    const token = generateToken(user._id.toString());
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        setupComplete: user.setupComplete,
      },
    });
  } catch (err) {
    console.error('Register detailed error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    if (email) email = email.toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[auth] Login failed: User not found (${email})`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    console.log(`[auth] Found user: ${user.email}, role: ${user.role}`);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`[auth] Login failed: Password mismatch for ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    const token = generateToken(user._id.toString());
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        setupComplete: user.setupComplete,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        setupComplete: user.setupComplete,
      },
    });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
