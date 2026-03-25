const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const InfluencerProfile = require('./models/InfluencerProfile');

dotenv.config();

// Use MONGODB_URI from .env as the primary source
const uri = process.env.MONGODB_URI ;

const realInfluencers = [
    { name: "Apoorva", email: "the.rebelkid@gmail.com", handle: "@the.rebelkid", yt: "@the.rebelkid" },
    { name: "Arsh Goyal", email: "arsh.goyal@gmail.com", handle: "@ArshGoyal", yt: "@ArshGoyal" },
    { name: "Codebasics", email: "codebasics.official@gmail.com", handle: "@codebasics", yt: "@codebasics" },
    { name: "Jhanvi Bhatia", email: "jhanvi.bhatia@gmail.com", handle: "@jhanvibhatia", yt: "@jhanvibhatia" },
    { name: "Raj Shamani", email: "raj.shamani@gmail.com", handle: "@rajshamani", yt: "@rajshamani" },
    { name: "MrBeast", email: "beast.official@gmail.com", handle: "@MrBeast", yt: "@MrBeast" },
    { name: "Technical Guruji", email: "tg.official@gmail.com", handle: "@TechnicalGuruji", yt: "@TechnicalGuruji" },
    { name: "Kurzgesagt", email: "kurz.official@gmail.com", handle: "@Kurzgesagt", yt: "@Kurzgesagt" },
    { name: "Unbox Therapy", email: "unbox.therapy@gmail.com", handle: "@unboxtherapy", yt: "@unboxtherapy" },
    { name: "MKBHD", email: "marques.hd@gmail.com", handle: "@mkbhd", yt: "@mkbhd" }
];

async function runSeed() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(uri);
        console.log('Connected.');

        // 1. CLEAR EXISTING DATA (To ensure no @collabrix remains)
      

        for (const data of realInfluencers) {
            console.log(`Setting up ${data.name}...`);
            
            // Create user
            let user = await User.findOne({ email: data.email });
            if (!user) {
                user = await User.create({
                    name: data.name,
                    email: data.email,
                    password: "password123",
                    role: "influencer",
                    setupComplete: true
                });
            }

            // Create profile
            const profile = await InfluencerProfile.findOne({ userId: user._id });
            if (!profile) {
                await InfluencerProfile.create({
                    userId: user._id,
                    name: data.name,
                    handle: data.handle,
                    youtube: data.yt, // The key for our Spark Sync
                    location: "Global",
                    followers: 0,
                    engagement: 0,
                    ytSubscribers: 0,
                    healthScore: 90
                });
                console.log(`✅ Success: ${data.name}`);
            }
        }

        console.log('\n🎉 ALL REAL CREATORS SEEDED SUCCESSFULLY!');
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}

runSeed();
