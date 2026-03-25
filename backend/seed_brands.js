const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const BrandProfile = require('./models/BrandProfile');

dotenv.config();

const uri = process.env.MONGODB_URI;

const brandsToSeed = [
    { name: "NexGen", industry: "Technology", website: "https://nexgen.io", logo: "🚀" },
    { name: "Cloudify", industry: "SaaS", website: "https://cloudify.com", logo: "☁️" },
    { name: "Zestio", industry: "Food & Beverage", website: "https://zestio.co", logo: "🍋" },
    { name: "Lumina", industry: "Health & Wellness", website: "https://lumina.health", logo: "✨" },
    { name: "Verve", industry: "Fintech", website: "https://verve.finance", logo: "💳" },
    { name: "Streamy", industry: "Entertainment", website: "https://streamy.app", logo: "🎥" },
    { name: "AlgoWise", industry: "AI/ML", website: "https://algowise.ai", logo: "🧠" },
    { name: "DataFlow", industry: "Big Data", website: "https://dataflow.io", logo: "📊" },
    { name: "SkillUp", industry: "EdTech", website: "https://skillup.com", logo: "🎓" },
    { name: "ZenLife", industry: "Lifestyle", website: "https://zenlife.co", logo: "🧘" },
    { name: "AeroPulse", industry: "Logistics", website: "https://aeropulse.com", logo: "🛫" },
    { name: "FitSync", industry: "Fitness", website: "https://fitsync.app", logo: "🏃" },
    { name: "MindArc", industry: "Software", website: "https://mindarc.dev", logo: "⚒️" },
    { name: "SocialPro", industry: "Marketing", website: "https://socialpro.app", logo: "📢" },
    { name: "AutoMind", industry: "Automotive", website: "https://automind.ai", logo: "🚕" }
];

async function runSeed() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(uri);
        console.log('Connected.');

        for (const data of brandsToSeed) {
            const email = `${data.name.toLowerCase().replace(/\s+/g, '')}@collabrix.com`;
            console.log(`Setting up ${data.name} (${email})...`);
            
            // Create user
            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    name: data.name,
                    email: email,
                    password: "password123",
                    role: "brand",
                    setupComplete: true
                });
                console.log(`  User created: ${user._id}`);
            } else {
                console.log(`  User already exists: ${user._id}`);
            }

            // Create profile
            let profile = await BrandProfile.findOne({ userId: user._id });
            if (!profile) {
                profile = await BrandProfile.create({
                    userId: user._id,
                    name: data.name,
                    logo: data.logo,
                    industry: data.industry,
                    website: data.website,
                    description: `${data.name} is a leading brand in the ${data.industry} industry.`,
                    budget: "₹10L - ₹50L"
                });
                console.log(`  Profile created: ${profile._id}`);
            } else {
                console.log(`  Profile already exists.`);
            }
        }

        const count = await User.countDocuments({ role: 'brand' });
        console.log(`\n🎉 SEEDING COMPLETED! Total brands in DB: ${count}`);
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

runSeed();
