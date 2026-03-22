const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const InfluencerProfile = require('./models/InfluencerProfile');
const BrandProfile = require('./models/BrandProfile');
const Analytics = require('./models/Analytics');
const Campaign = require('./models/Campaign');

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

const seedData = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for seeding extra data...');

    const extraUsers = [
      {
        name: 'Sneha Kapoor',
        email: 'sneha@collabrix.com',
        password: 'password123',
        role: 'influencer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha'
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun@collabrix.com',
        password: 'password123',
        role: 'influencer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun'
      },
      {
        name: 'Zara Fashion',
        email: 'zara@collabrix.com',
        password: 'password123',
        role: 'brand',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ZF'
      },
      {
        name: 'TechGear',
        email: 'techgear@collabrix.com',
        password: 'password123',
        role: 'brand',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TG'
      }
    ];

    for (const u of extraUsers) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`User ${u.email} already exists, skipping.`);
        continue;
      }
      const user = new User(u);
      await user.save();
      console.log(`Created user: ${u.email}`);

      if (u.role === 'influencer') {
        const profile = new InfluencerProfile({
          userId: user._id,
          name: u.name,
          username: u.name.toLowerCase().replace(' ', ''),
          bio: 'Eco-conscious lifestyle & sustainable fashion advocate.',
          location: 'Bangalore, India',
          categories: ['Lifestyle', 'Fashion', 'Sustainability'],
          stats: {
            followers: '450K',
            engagement: '4.8%',
            avgLikes: '22K',
            reach: '1.2M'
          },
          platforms: [
            { name: 'Instagram', url: '#', followers: '300K' },
            { name: 'YouTube', url: '#', followers: '150K' }
          ],
          faqs: [
            { question: "What is your typical turnaround time?", answer: "Usually 5-7 business days." },
            { question: "Do you offer whitelisting?", answer: "Yes, for an additional fee." }
          ]
        });
        await profile.save();

        const analytics = new Analytics({
          userId: user._id,
          influencer: {
            totalFollowers: 450000,
            engagementRate: 4.8,
            avgReach: 120000,
            avgViews: 85000,
            topLocations: [
              { location: 'Mumbai', percentage: 35 },
              { location: 'Delhi', percentage: 25 },
              { location: 'Bangalore', percentage: 20 }
            ],
            ageDemographics: [
              { range: '18-24', percentage: 40 },
              { range: '25-34', percentage: 45 },
              { range: '35+', percentage: 15 }
            ],
            genderDemographics: { male: 30, female: 70 },
            growthData: [
              { date: '2024-01', followers: 420000 },
              { date: '2024-02', followers: 435000 },
              { date: '2024-03', followers: 450000 }
            ]
          }
        });
        await analytics.save();
      } else {
        const brand = new BrandProfile({
          userId: user._id,
          name: u.name,
          industry: u.name === 'Zara Fashion' ? 'Fashion' : 'Technology',
          website: u.name === 'Zara Fashion' ? 'www.zara.com' : 'www.techgear.com',
          description: `Leading ${u.name === 'Zara Fashion' ? 'global fashion retailer' : 'innovative tech hardware company'}.`,
          values: ['Quality', 'Innovation', 'Sustainability'],
          logo: u.avatar
        });
        await brand.save();

        const bAnalytics = new Analytics({
          userId: user._id,
          brand: {
            totalSpent: 4500000,
            activeCampaigns: 5,
            totalInfluencers: 28,
            topCampaigns: [
              { name: 'Summer 2024', spent: 1200000, roi: 4.5 },
              { name: 'Tech Expo', spent: 800000, roi: 3.2 }
            ],
            monthlySpending: [
              { month: 'Jan', amount: 400000 },
              { month: 'Feb', amount: 550000 },
              { month: 'Mar', amount: 600000 }
            ]
          }
        });
        await bAnalytics.save();
      }
    }

    // Add some sample campaigns for TechGear
    const techUser = await User.findOne({ email: 'techgear@collabrix.com' });
    if (techUser) {
      const campaignsCount = await Campaign.countDocuments({ brandId: techUser._id });
      if (campaignsCount === 0) {
        const newCampaigns = [
          {
            brandId: techUser._id,
            brandName: 'TechGear',
            title: 'Gaming Mouse Review',
            description: 'Send our new X-100 mouse to 5 gaming influencers for review.',
            status: 'pending',
            budget: '₹50,000',
            deadline: '2024-05-15',
            deliverables: ['1 YouTube video', '1 Instagram Reel']
          },
          {
            brandId: techUser._id,
            brandName: 'TechGear',
            title: 'Winter Sale Promotion',
            description: 'Promote our high-performance laptops during the winter clearance.',
            status: 'in_progress',
            budget: '₹2,50,000',
            deadline: '2024-04-20',
            deliverables: ['3 Stories', '1 Static post']
          }
        ];
        await Campaign.insertMany(newCampaigns);
        console.log('Created sample campaigns for TechGear');
      }
    }

    console.log('🚀 Seeding finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedData();
