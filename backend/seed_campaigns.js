const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Campaign = require('./models/Campaign');
const Analytics = require('./models/Analytics');

dotenv.config();

const uri = process.env.MONGODB_URI;

async function runSeed() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(uri);
        console.log('Connected.');

        // 1. Get ALL Brands
        const brands = await User.find({ role: 'brand' });
        if (brands.length === 0) {
            console.log('No brands found in DB. Please run seed_brands.js first.');
            process.exit(1);
        }

        // 2. Get ALL Influencers
        const influencers = await User.find({ role: 'influencer' });
        console.log(`Found ${influencers.length} influencers.`);

        for (const influencer of influencers) {
            console.log(`\nChecking records for: ${influencer.name} (${influencer._id})...`);
            
            // Check Campaigns
            const campaignCount = await Campaign.countDocuments({ influencerId: influencer._id });
            const analyticsCount = await Analytics.countDocuments({ userId: influencer._id });

            if (campaignCount === 0) {
                console.log(`  Seeding campaigns for ${influencer.name}...`);
                const demoCampaigns = [
                    {
                        brandId: brands[0]._id,
                        brandName: brands[0].name,
                        brandLogo: "🚀",
                        influencerId: influencer._id,
                        influencerName: influencer.name,
                        title: "NexGen Product Launch",
                        description: "Exclusive deep-dive into our next-gen platform.",
                        status: "accepted",
                        budget: "₹2.5L",
                        deadline: "2026-05-15"
                    },
                    {
                        brandId: brands[1]._id,
                        brandName: brands[1].name,
                        brandLogo: "☁️",
                        influencerId: influencer._id,
                        influencerName: influencer.name,
                        title: "Cloudify Workflow Challenge",
                        description: "Show how you streamline your creative process using Cloudify.",
                        status: "in_progress",
                        budget: "₹1.8L",
                        deadline: "2026-06-10"
                    },
                    {
                        brandId: brands[2]._id,
                        brandName: brands[2].name,
                        brandLogo: "🍋",
                        influencerId: influencer._id,
                        influencerName: influencer.name,
                        title: "Summer Vibes Lookbook",
                        description: "Incorporate Zestio drinks into your lifestyle vlog for the summer season.",
                        status: "completed",
                        budget: "₹95K",
                        deadline: "2026-03-01"
                    }
                ];
                // Shuffle brands for variety
                const shiftedBrands = [...brands].sort(() => 0.5 - Math.random());
                for (let i = 0; i < demoCampaigns.length; i++) {
                    demoCampaigns[i].brandId = shiftedBrands[i]._id;
                    demoCampaigns[i].brandName = shiftedBrands[i].name;
                }
                await Campaign.insertMany(demoCampaigns);
                console.log(`  ✅ 3 campaigns added.`);
            } else {
                console.log(`  Already has ${campaignCount} campaigns.`);
            }

            if (analyticsCount === 0) {
                console.log(`  Seeding analytics for ${influencer.name}...`);
                const randomSubs = Math.floor(Math.random() * 5000000) + 100000;
                const randomViews = randomSubs * 10;
                
                const mockAnalytics = {
                    userId: influencer._id,
                    ytOverview: {
                        totalViews: randomViews,
                        subscribers: randomSubs,
                        avgWatchTime: "6:45",
                        totalVideos: Math.floor(Math.random() * 200) + 50
                    },
                    ytMonthlyViews: [
                        { month: "Jan", views: randomViews / 10 },
                        { month: "Feb", views: randomViews / 9 },
                        { month: "Mar", views: randomViews / 8 }
                    ],
                    ytDemographics: [
                        { age: "18-24", percent: 45 }, { age: "25-34", percent: 35 }, { age: "35-44", percent: 20 }
                    ],
                    ytGenderSplit: [
                        { gender: "Male", percent: 60 }, { gender: "Female", percent: 40 }
                    ],
                    healthScore: 85,
                    platformComparison: [
                        { platform: "YouTube", followers: randomSubs, engagement: 4.5, growth: 15 },
                        { platform: "Instagram", followers: Math.floor(randomSubs * 0.4), engagement: 6.2, growth: 8 }
                    ],
                    postingBestTimes: [
                        { time: "19:00", engagement: 90 }, { time: "21:00", engagement: 85 }
                    ],
                    postingBestDays: [
                        { day: "Sun", engagement: 95 }, { day: "Sat", engagement: 88 }
                    ]
                };
                await Analytics.create(mockAnalytics);
                console.log(`  ✅ Analytics record created.`);
            } else {
                console.log(`  Already has analytics.`);
            }
        }

        console.log('\n🎉 ALL EMPTY INFLUENCERS HAVE BEEN SEEDED!');
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

runSeed();
