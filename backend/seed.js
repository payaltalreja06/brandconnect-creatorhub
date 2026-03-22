/**
 * seed.js — Populates MongoDB Atlas with dummy data for BrandConnect CreatorHub
 * Run: node seed.js
 * 
 * Data pipeline note: Analytics data is structured to match what a Spark pipeline
 * would compute from raw event streams and store in MongoDB. Field names and
 * structure are intentionally designed for future pipeline integration.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const InfluencerProfile = require('./models/InfluencerProfile');
const BrandProfile = require('./models/BrandProfile');
const Campaign = require('./models/Campaign');
const CollabRequest = require('./models/CollabRequest');
const Thread = require('./models/Thread');
const Message = require('./models/Message');
const Notification = require('./models/Notification');
const Analytics = require('./models/Analytics');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas connected');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      InfluencerProfile.deleteMany({}),
      BrandProfile.deleteMany({}),
      Campaign.deleteMany({}),
      CollabRequest.deleteMany({}),
      Thread.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Analytics.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    const passwordHash = await bcrypt.hash('password123', 12);

    // ─────────────────────────────────────────────
    // INFLUENCER USERS
    // ─────────────────────────────────────────────
    const influencerData = [
      { name: 'Priya Sharma', email: 'priya@collabrix.com', handle: '@priyaskincare', location: 'Mumbai, India', domain: ['Skincare', 'Beauty'], bio: 'Dermatologist-turned-creator sharing honest skincare reviews and routines. Featured in Vogue India.', rate: '₹80,000 - ₹1,50,000', price: 247, followers: 2400000, engagement: 4.8, ytSubscribers: 1800000, instaFollowers: 600000, healthScore: 87, verified: true, platforms: ['YouTube', 'Instagram'], contentType: ['UGC', 'Reels'], gender: 'Female', age: '25-34', language: 'English', badges: ['Top Creator'], rating: 5.0, reviewCount: 34,
        faqs: [
          { question: 'Do you offer UGC videos?', answer: 'Yes, I create high-quality UGC starting from ₹20,000 per video.' },
          { question: 'What is your turnaround time?', answer: 'Usually 5-7 business days after receiving the product.' },
          { question: 'Do you work with international brands?', answer: 'Absolutely! I have worked with brands from US, UK, and UAE.' },
          { question: 'What niches do you cover?', answer: 'Skincare, beauty, wellness, and occasionally lifestyle content.' },
        ],
      },
      { name: 'Arjun Mehta', email: 'arjun@collabrix.com', handle: '@arjunfitlife', location: 'Delhi, India', domain: ['Fitness', 'Health'], bio: 'Certified personal trainer helping you transform your life. 500+ client transformations.', rate: '₹60,000 - ₹1,20,000', price: 150, followers: 1800000, engagement: 5.2, ytSubscribers: 1200000, instaFollowers: 600000, healthScore: 82, verified: true, platforms: ['YouTube', 'Instagram'], contentType: ['UGC', 'Videos'], gender: 'Male', age: '25-34', language: 'English', badges: ['Responds Fast'], rating: 4.8, reviewCount: 22,
        faqs: [
          { question: 'Do you do paid promotions for supplements?', answer: 'Yes, but only for brands I personally use and trust.' },
          { question: 'Can you create workout videos for brands?', answer: 'Yes! Custom branded workout content is one of my specialties.' },
        ],
      },
      { name: 'Sneha Kapoor', email: 'sneha@collabrix.com', handle: '@snehastyle', location: 'Bangalore, India', domain: ['Fashion', 'Lifestyle'], bio: 'Fashion editor & sustainable style advocate. Collaborating with 50+ ethical brands.', rate: '₹50,000 - ₹1,00,000', price: 100, followers: 1500000, engagement: 3.9, ytSubscribers: 500000, instaFollowers: 1000000, healthScore: 74, verified: true, platforms: ['Instagram', 'YouTube'], contentType: ['UGC', 'Posts'], gender: 'Female', age: '25-34', language: 'English', badges: ['Top Creator', 'Responds Fast'], rating: 4.7, reviewCount: 18,
        faqs: [
          { question: 'Do you work with fast fashion brands?', answer: 'I prioritize sustainable brands but evaluate case-by-case.' },
          { question: 'What is your average story view count?', answer: 'Typically 80,000–120,000 views per story.' },
        ],
      },
      { name: 'Ravi Kumar', email: 'ravi@collabrix.com', handle: '@techwithravi', location: 'Hyderabad, India', domain: ['Tech', 'Education'], bio: 'Making tech accessible. Gadget reviews, coding tutorials, and startup insights.', rate: '₹1,00,000 - ₹2,00,000', price: 300, followers: 3200000, engagement: 6.1, ytSubscribers: 2800000, instaFollowers: 400000, healthScore: 91, verified: true, platforms: ['YouTube', 'Instagram'], contentType: ['Videos', 'Reviews'], gender: 'Male', age: '25-34', language: 'English', badges: ['Top Creator'], rating: 5.0, reviewCount: 41,
        faqs: [
          { question: 'Do you review competitor products honestly?', answer: 'Yes, my reviews are 100% honest. That\'s what my audience trusts me for.' },
          { question: 'What is your YouTube channel CTR?', answer: 'Average 8–12% CTR depending on the topic.' },
        ],
      },
      { name: 'Meera Nair', email: 'meera@collabrix.com', handle: '@meeraglows', location: 'Kochi, India', domain: ['Skincare', 'Health'], bio: 'Ayurvedic skincare enthusiast. Sharing natural remedies that actually work.', rate: '₹25,000 - ₹60,000', price: 55, followers: 750000, engagement: 8.1, ytSubscribers: 250000, instaFollowers: 500000, healthScore: 83, verified: false, platforms: ['Instagram', 'YouTube'], contentType: ['UGC', 'Reels'], gender: 'Female', age: '18-24', language: 'English', badges: ['Top Creator'], rating: 5.0, reviewCount: 28,
        faqs: [
          { question: 'Do you accept product-only collaborations?', answer: 'I prefer paid collaborations but consider barter for brands I love.' },
          { question: 'What is your Reel average views?', answer: 'My Reels typically get 200K–500K views.' },
        ],
      },
    ];

    // ─────────────────────────────────────────────
    // BRAND USERS
    // ─────────────────────────────────────────────
    const brandData = [
      { name: 'GlowSkin Co.', email: 'glowskin@collabrix.com', logo: '🧴', domain: 'Skincare', description: 'Premium organic skincare brand trusted by 2M+ customers', industry: 'Beauty & Skincare', budget: '₹5,00,000 - ₹15,00,000', website: 'glowskin.co', contactEmail: 'collab@glowskin.co', campaigns: 12,
        faqs: [
          { question: 'What is your typical turnaround time for reviewing proposals?', answer: 'We usually review creator pitches within 48 hours and finalize contracts in under a week.' },
          { question: 'Do you provide free products?', answer: 'Yes, all selected creators receive a PR package with products, alongside monetary compensation.' },
          { question: 'What content rights do you require?', answer: 'We require 6 months of usage rights for paid social. Full buyout is negotiable.' },
        ],
      },
      { name: 'FitGear Pro', email: 'fitgear@collabrix.com', logo: '💪', domain: 'Fitness', description: 'Performance fitness equipment for serious athletes', industry: 'Fitness & Sports', budget: '₹3,00,000 - ₹10,00,000', website: 'fitgearpro.in', contactEmail: 'brand@fitgearpro.in', campaigns: 8,
        faqs: [
          { question: 'Do you offer affiliate programs?', answer: 'Yes! Creators get a custom discount code with 15% commission on sales.' },
        ],
      },
      { name: 'TechNova', email: 'technova@collabrix.com', logo: '🔧', domain: 'Tech', description: 'Consumer electronics brand revolutionizing everyday life', industry: 'Technology', budget: '₹10,00,000 - ₹25,00,000', website: 'technova.in', contactEmail: 'marketing@technova.in', campaigns: 6,
        faqs: [
          { question: 'Do you send review units before finalizing deals?', answer: 'Yes, we send units to creators we\'re seriously considering for full deals.' },
        ],
      },
    ];

    // Create influencer users
    const createdInfluencers = [];
    for (const inf of influencerData) {
      const user = new User({
        name: inf.name,
        email: inf.email,
        password: passwordHash,
        role: 'influencer',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(inf.name)}`,
      });
      user.password = passwordHash; // Skip pre-save hook for seeding
      await User.collection.insertOne({
        name: user.name,
        email: user.email,
        password: passwordHash,
        role: 'influencer',
        avatar: user.avatar,
        setupComplete: true,
        createdAt: new Date(),
      });
      const savedUser = await User.findOne({ email: inf.email });
      createdInfluencers.push({ user: savedUser, data: inf });
    }

    // Create brand users
    const createdBrands = [];
    for (const br of brandData) {
      await User.collection.insertOne({
        name: br.name,
        email: br.email,
        password: passwordHash,
        role: 'brand',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(br.name)}`,
        setupComplete: true,
        createdAt: new Date(),
      });
      const savedUser = await User.findOne({ email: br.email });
      createdBrands.push({ user: savedUser, data: br });
    }

    console.log(`✅ Created ${createdInfluencers.length} influencer users`);
    console.log(`✅ Created ${createdBrands.length} brand users`);

    // ─────────────────────────────────────────────
    // INFLUENCER PROFILES
    // ─────────────────────────────────────────────
    for (const { user, data } of createdInfluencers) {
      await InfluencerProfile.create({
        userId: user._id,
        name: data.name,
        handle: data.handle,
        avatar: user.avatar,
        coverImage: '',
        bio: data.bio,
        location: data.location,
        domain: data.domain,
        platforms: data.platforms,
        rate: data.rate,
        price: data.price,
        followers: data.followers,
        engagement: data.engagement,
        ytSubscribers: data.ytSubscribers,
        instaFollowers: data.instaFollowers,
        healthScore: data.healthScore,
        verified: data.verified,
        rating: data.rating,
        reviewCount: data.reviewCount,
        contentType: data.contentType,
        gender: data.gender,
        age: data.age,
        language: data.language,
        badges: data.badges,
        faqs: data.faqs || [],
        platformStats: [
          { platform: 'YouTube', followers: data.ytSubscribers, engagement: data.engagement * 0.8, growth: 12.5, content: 200 },
          { platform: 'Instagram', followers: data.instaFollowers, engagement: data.engagement * 1.3, growth: 18.3, content: 450 },
        ],
      });
    }

    // ─────────────────────────────────────────────
    // BRAND PROFILES
    // ─────────────────────────────────────────────
    for (const { user, data } of createdBrands) {
      await BrandProfile.create({
        userId: user._id,
        name: data.name,
        logo: data.logo,
        domain: data.domain,
        description: data.description,
        industry: data.industry,
        budget: data.budget,
        website: data.website,
        contactEmail: data.contactEmail,
        campaigns: data.campaigns,
        faqs: data.faqs || [],
      });
    }
    console.log('✅ Profiles created');

    // ─────────────────────────────────────────────
    // ANALYTICS DATA (structured for Spark pipeline)
    // ─────────────────────────────────────────────
    const [priya, arjun, sneha] = createdInfluencers;
    const [glowskin, fitgear] = createdBrands;

    await Analytics.create({
      userId: priya.user._id,
      ytOverview: { totalViews: 12500000, subscribers: 1800000, avgWatchTime: '4:32', totalVideos: 245 },
      ytMonthlyViews: [
        { month: 'Aug', views: 850000 }, { month: 'Sep', views: 920000 }, { month: 'Oct', views: 1100000 },
        { month: 'Nov', views: 980000 }, { month: 'Dec', views: 1350000 }, { month: 'Jan', views: 1450000 },
      ],
      ytRecentVideos: [
        { title: 'Morning Skincare Routine 2024', views: 520000, likes: 32000, comments: 1800, ctr: 8.2, avgViewDuration: '5:12', retention: 62, date: '2024-01-15' },
        { title: 'Top 10 Serums Under ₹500', views: 890000, likes: 56000, comments: 3200, ctr: 11.5, avgViewDuration: '6:45', retention: 71, date: '2024-01-10' },
        { title: 'Sunscreen Myths Busted', views: 340000, likes: 21000, comments: 950, ctr: 6.8, avgViewDuration: '4:02', retention: 55, date: '2024-01-05' },
        { title: 'Winter Skincare Tips', views: 670000, likes: 41000, comments: 2100, ctr: 9.1, avgViewDuration: '5:38', retention: 65, date: '2023-12-28' },
        { title: 'Drugstore vs Luxury Products', views: 1200000, likes: 78000, comments: 4500, ctr: 13.2, avgViewDuration: '7:15', retention: 74, date: '2023-12-20' },
      ],
      ytDemographics: [{ age: '18-24', percent: 35 }, { age: '25-34', percent: 42 }, { age: '35-44', percent: 15 }, { age: '45+', percent: 8 }],
      ytGenderSplit: [{ gender: 'Female', percent: 68 }, { gender: 'Male', percent: 28 }, { gender: 'Other', percent: 4 }],
      ytTopCountries: [{ country: 'India', percent: 72 }, { country: 'USA', percent: 12 }, { country: 'UK', percent: 6 }, { country: 'Canada', percent: 4 }, { country: 'Others', percent: 6 }],
      ytDeviceUsage: [{ device: 'Mobile', percent: 78 }, { device: 'Desktop', percent: 16 }, { device: 'Tablet', percent: 4 }, { device: 'TV', percent: 2 }],
      instaOverview: { followers: 600000, reach: 2800000, impressions: 5200000, profileVisits: 45000 },
      instaRecentPosts: [
        { type: 'Reel', caption: 'Glass skin tutorial ✨', likes: 45000, comments: 2300, shares: 8900, saves: 12000, reach: 580000, date: '2024-01-14' },
        { type: 'Reel', caption: '3-step routine for beginners', likes: 62000, comments: 3100, shares: 15000, saves: 18000, reach: 720000, date: '2024-01-11' },
        { type: 'Post', caption: 'My holy grail products', likes: 28000, comments: 1500, shares: 3200, saves: 7800, reach: 320000, date: '2024-01-08' },
      ],
      instaWeeklyReach: [
        { week: 'W1', reach: 420000 }, { week: 'W2', reach: 510000 }, { week: 'W3', reach: 380000 },
        { week: 'W4', reach: 620000 }, { week: 'W5', reach: 550000 }, { week: 'W6', reach: 700000 },
      ],
      instaEngagementByType: [{ type: 'Reels', rate: 6.8 }, { type: 'Posts', rate: 3.2 }, { type: 'Stories', rate: 4.5 }, { type: 'Carousels', rate: 5.1 }],
      postingWeeklyPosts: [{ week: 'W1', posts: 5 }, { week: 'W2', posts: 7 }, { week: 'W3', posts: 4 }, { week: 'W4', posts: 6 }, { week: 'W5', posts: 8 }, { week: 'W6', posts: 5 }],
      postingBestTimes: [{ time: '9 AM', engagement: 4.2 }, { time: '12 PM', engagement: 5.8 }, { time: '3 PM', engagement: 3.9 }, { time: '6 PM', engagement: 7.1 }, { time: '9 PM', engagement: 6.5 }],
      postingBestDays: [{ day: 'Mon', engagement: 4.1 }, { day: 'Tue', engagement: 5.3 }, { day: 'Wed', engagement: 4.8 }, { day: 'Thu', engagement: 5.9 }, { day: 'Fri', engagement: 6.2 }, { day: 'Sat', engagement: 7.4 }, { day: 'Sun', engagement: 6.8 }],
      totalEarnings: '₹8,45,000',
      monthlyEarnings: [
        { month: 'Aug', earnings: 85000 }, { month: 'Sep', earnings: 120000 }, { month: 'Oct', earnings: 95000 },
        { month: 'Nov', earnings: 150000 }, { month: 'Dec', earnings: 180000 }, { month: 'Jan', earnings: 215000 },
      ],
      earningsByBrand: [{ brand: 'GlowSkin Co.', amount: 320000 }, { brand: 'FitGear Pro', amount: 195000 }, { brand: 'StyleVerse', amount: 180000 }, { brand: 'TechNova', amount: 150000 }],
      pendingPayments: '₹1,80,000',
      completedPayments: '₹6,65,000',
      platformComparison: [
        { platform: 'YouTube', followers: 1800000, engagement: 4.8, growth: 12.5, content: 245 },
        { platform: 'Instagram', followers: 600000, engagement: 6.2, growth: 18.3, content: 520 },
      ],
      healthScore: 87,
      healthBreakdown: {
        engagement: { weight: 40, score: 92 },
        growth: { weight: 30, score: 85 },
        audienceQuality: { weight: 20, score: 78 },
        campaignSuccess: { weight: 10, score: 90 },
      },
    });

    // Arjun analytics
    await Analytics.create({
      userId: arjun.user._id,
      ytOverview: { totalViews: 8200000, subscribers: 1200000, avgWatchTime: '5:15', totalVideos: 180 },
      ytMonthlyViews: [
        { month: 'Aug', views: 620000 }, { month: 'Sep', views: 710000 }, { month: 'Oct', views: 850000 },
        { month: 'Nov', views: 780000 }, { month: 'Dec', views: 920000 }, { month: 'Jan', views: 1020000 },
      ],
      ytDemographics: [{ age: '18-24', percent: 28 }, { age: '25-34', percent: 48 }, { age: '35-44', percent: 18 }, { age: '45+', percent: 6 }],
      ytGenderSplit: [{ gender: 'Female', percent: 32 }, { gender: 'Male', percent: 65 }, { gender: 'Other', percent: 3 }],
      instaOverview: { followers: 600000, reach: 1800000, impressions: 3200000, profileVisits: 28000 },
      instaEngagementByType: [{ type: 'Reels', rate: 7.2 }, { type: 'Posts', rate: 4.1 }, { type: 'Stories', rate: 5.8 }, { type: 'Carousels', rate: 6.3 }],
      postingBestTimes: [{ time: '6 AM', engagement: 5.1 }, { time: '12 PM', engagement: 6.3 }, { time: '6 PM', engagement: 8.2 }, { time: '9 PM', engagement: 7.4 }],
      postingBestDays: [{ day: 'Mon', engagement: 5.2 }, { day: 'Wed', engagement: 6.8 }, { day: 'Fri', engagement: 7.9 }, { day: 'Sat', engagement: 8.4 }, { day: 'Sun', engagement: 7.1 }],
      totalEarnings: '₹5,20,000',
      monthlyEarnings: [
        { month: 'Aug', earnings: 60000 }, { month: 'Sep', earnings: 85000 }, { month: 'Oct', earnings: 70000 },
        { month: 'Nov', earnings: 110000 }, { month: 'Dec', earnings: 130000 }, { month: 'Jan', earnings: 165000 },
      ],
      platformComparison: [
        { platform: 'YouTube', followers: 1200000, engagement: 5.2, growth: 15.2, content: 180 },
        { platform: 'Instagram', followers: 600000, engagement: 7.2, growth: 22.1, content: 380 },
      ],
      healthScore: 82,
      healthBreakdown: {
        engagement: { weight: 40, score: 88 },
        growth: { weight: 30, score: 79 },
        audienceQuality: { weight: 20, score: 82 },
        campaignSuccess: { weight: 10, score: 85 },
      },
    });

    // GlowSkin brand analytics
    await Analytics.create({
      userId: glowskin.user._id,
      brandOverview: {
        totalCampaigns: 12,
        activeCampaigns: 3,
        completedCampaigns: 8,
        totalSpending: '₹15,60,000',
        avgCampaignROI: 4.2,
        successRate: 92,
      },
      brandSpendingTrend: [
        { month: 'Aug', spending: 120000 }, { month: 'Sep', spending: 180000 }, { month: 'Oct', spending: 95000 },
        { month: 'Nov', spending: 250000 }, { month: 'Dec', spending: 320000 }, { month: 'Jan', spending: 195000 },
      ],
      brandCampaignPerformance: [
        { campaign: 'Summer Skincare Launch', engagement: 5.2, roi: 3.8, reach: 2400000 },
        { campaign: 'Winter Glow Campaign', engagement: 7.8, roi: 5.1, reach: 1200000 },
        { campaign: 'Monsoon Moisture Series', engagement: 4.9, roi: 3.2, reach: 980000 },
      ],
      brandInfluencerComparison: [
        { name: 'Priya Sharma', engagement: 4.8, roi: 3.8, campaigns: 3 },
        { name: 'Meera Nair', engagement: 8.1, roi: 5.1, campaigns: 2 },
        { name: 'Sneha Kapoor', engagement: 3.9, roi: 2.9, campaigns: 1 },
      ],
    });

    // Fill analytics for remaining users
    for (const { user } of [...createdInfluencers.slice(2), ...createdBrands.slice(1)]) {
      const existing = await Analytics.findOne({ userId: user._id });
      if (!existing) {
        await Analytics.create({
          userId: user._id,
          healthScore: Math.floor(Math.random() * 30) + 65,
          totalEarnings: '₹0',
          brandOverview: { totalCampaigns: 0, activeCampaigns: 0, completedCampaigns: 0, totalSpending: '₹0', avgCampaignROI: 0, successRate: 0 },
        });
      }
    }

    console.log('✅ Analytics created');

    // ─────────────────────────────────────────────
    // CAMPAIGNS
    // ─────────────────────────────────────────────
    const campaigns = await Campaign.insertMany([
      {
        brandId: glowskin.user._id, brandName: 'GlowSkin Co.', brandLogo: '🧴',
        influencerId: priya.user._id, influencerName: 'Priya Sharma',
        title: 'Summer Skincare Launch', description: 'Promote our new SPF50 sunscreen range across YouTube and Instagram',
        deliverables: ['1 YouTube video', '2 Instagram Reels', '3 Stories'], budget: '₹1,20,000',
        deadline: '2024-03-15', status: 'in_progress', engagement: 5.2, roi: 3.8,
      },
      {
        brandId: fitgear.user._id, brandName: 'FitGear Pro', brandLogo: '💪',
        influencerId: arjun.user._id, influencerName: 'Arjun Mehta',
        title: 'New Year Fitness Challenge', description: '30-day fitness transformation challenge featuring our equipment',
        deliverables: ['4 YouTube videos', 'Daily Instagram Stories', '1 Reel'], budget: '₹95,000',
        deadline: '2024-02-28', status: 'completed', engagement: 6.1, roi: 4.2,
      },
      {
        brandId: glowskin.user._id, brandName: 'GlowSkin Co.', brandLogo: '🧴',
        title: 'Winter Glow Campaign', description: 'Winter skincare routine featuring our moisturizer range',
        deliverables: ['1 YouTube video', '2 Reels'], budget: '₹85,000',
        deadline: '2024-01-30', status: 'pending',
      },
    ]);
    console.log('✅ Campaigns created');

    // ─────────────────────────────────────────────
    // COLLAB REQUEST + THREAD + MESSAGES (demo)
    // ─────────────────────────────────────────────
    const thread = await Thread.create({
      participants: [glowskin.user._id, priya.user._id],
      participantNames: ['GlowSkin Co.', 'Priya Sharma'],
      participantAvatars: ['🧴', priya.user.avatar],
      campaignName: 'Summer Skincare Launch',
      lastMessage: 'Sure, I would love to discuss the campaign details!',
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: {
        [glowskin.user._id.toString()]: 1,
        [priya.user._id.toString()]: 0,
      },
    });

    const collabReq = await CollabRequest.create({
      fromUserId: glowskin.user._id, fromName: 'GlowSkin Co.', fromAvatar: '🧴', fromRole: 'brand',
      toUserId: priya.user._id, toName: 'Priya Sharma',
      campaignName: 'Summer Skincare Launch',
      message: 'Hi Priya! We love your skincare content and would love to collab on our SPF range.',
      budget: '₹1,20,000', status: 'accepted', threadId: thread._id,
    });

    const msgs = await Message.insertMany([
      { threadId: thread._id, senderId: glowskin.user._id, senderName: 'GlowSkin Co.', senderAvatar: '🧴', text: 'Hi Priya! We love your skincare content and would love to collab on our new SPF50 range.', status: 'seen', seenAt: new Date(Date.now() - 1000 * 60 * 25) },
      { threadId: thread._id, senderId: priya.user._id, senderName: 'Priya Sharma', senderAvatar: priya.user.avatar, text: 'Hi! That sounds amazing! I\'ve been looking at your products and they\'re exactly what my audience needs.', status: 'seen', seenAt: new Date(Date.now() - 1000 * 60 * 20) },
      { threadId: thread._id, senderId: glowskin.user._id, senderName: 'GlowSkin Co.', senderAvatar: '🧴', text: 'Glad to hear that! We\'re thinking 1 YouTube video + 2 Reels. Budget is ₹1,20,000. Thoughts?', status: 'seen', seenAt: new Date(Date.now() - 1000 * 60 * 15) },
      { threadId: thread._id, senderId: priya.user._id, senderName: 'Priya Sharma', senderAvatar: priya.user.avatar, text: 'That works for me! Can we discuss the timeline?', status: 'seen', seenAt: new Date(Date.now() - 1000 * 60 * 10) },
      { threadId: thread._id, senderId: glowskin.user._id, senderName: 'GlowSkin Co.', senderAvatar: '🧴', text: 'Sure, I would love to discuss the campaign details!', status: 'delivered', deliveredAt: new Date(Date.now() - 1000 * 60 * 5) },
    ]);

    // ─────────────────────────────────────────────
    // NOTIFICATIONS
    // ─────────────────────────────────────────────
    await Notification.insertMany([
      {
        userId: priya.user._id, type: 'collab_request', title: 'New Collaboration Request',
        description: 'GlowSkin Co. wants to collaborate: "Summer Skincare Launch"',
        fromUserId: glowskin.user._id, fromName: 'GlowSkin Co.', fromAvatar: '🧴',
        relatedId: collabReq._id.toString(), read: true,
      },
      {
        userId: priya.user._id, type: 'payment', title: 'Payment Received',
        description: '₹1,20,000 received from GlowSkin Co. for Summer Skincare Launch',
        fromUserId: glowskin.user._id, fromName: 'GlowSkin Co.', fromAvatar: '🧴',
        relatedId: campaigns[0]._id.toString(), read: true,
      },
      {
        userId: glowskin.user._id, type: 'campaign', title: 'Campaign Update',
        description: 'Priya Sharma submitted deliverables for Summer Skincare Launch',
        fromUserId: priya.user._id, fromName: 'Priya Sharma', fromAvatar: priya.user.avatar,
        relatedId: campaigns[0]._id.toString(), read: false,
      },
      {
        userId: arjun.user._id, type: 'collab_request', title: 'New Collaboration Request',
        description: 'FitGear Pro wants to collaborate: "New Year Fitness Challenge"',
        fromUserId: fitgear.user._id, fromName: 'FitGear Pro', fromAvatar: '💪',
        relatedId: collabReq._id.toString(), read: false,
      },
    ]);

    console.log('✅ Threads, messages, notifications created');
    console.log('\n🎉 Seed complete! Test credentials:');
    console.log('─────────────────────────────────');
    console.log('INFLUENCER: priya@collabrix.com / password123');
    console.log('INFLUENCER: arjun@collabrix.com / password123');
    console.log('INFLUENCER: sneha@collabrix.com / password123');
    console.log('INFLUENCER: ravi@collabrix.com  / password123');
    console.log('INFLUENCER: meera@collabrix.com / password123');
    console.log('BRAND:      glowskin@collabrix.com / password123');
    console.log('BRAND:      fitgear@collabrix.com  / password123');
    console.log('BRAND:      technova@collabrix.com / password123');
    console.log('─────────────────────────────────');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
