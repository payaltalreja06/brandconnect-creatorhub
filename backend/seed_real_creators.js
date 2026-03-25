const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const InfluencerProfile = require('./models/InfluencerProfile');

dotenv.config();

const uri = process.env.MONGO_URI || "mongodb+srv://payal08:A6bOLU8T0YAkIPZY@cluster0.ez6bp5h.mongodb.net/brandconnect?appName=Cluster0";

const realCreators = [
    { name: "MrBeast", email: "beast@gmail.com", handle: "@MrBeast", yt: "UCX6OQ3DkcsbYNE6H8uQQuVA" },
    { name: "Technical Guruji", email: "tg@gmail.com", handle: "@TechnicalGuruji", yt: "UCX6OQ3DkcsbYNE6H8uQQuVA" },
    { name: "Kurzgesagt", email: "kurz@gmail.com", handle: "@Kurzgesagt", yt: "UCX6OQ3DkcsbYNE6H8uQQuVA" },
    { name: "Unbox Therapy", email: "unbox@gmail.com", handle: "@unboxtherapy", yt: "UCX6OQ3DkcsbYNE6H8uQQuVA" },
    { name: "MKBHD", email: "marques@gmail.com", handle: "@mkbhd", yt: "UCBJycsmduvYELgKnCoRPNoA" },
    { name: "Veritasium", email: "verita@gmail.com", handle: "@veritasium", yt: "UCBJycsmduvYELgKnCoRPNoA" },
    { name: "The Rebel Kid", email: "apoorva.real@gmail.com", handle: "@the.rebelkid", yt: "@the.rebelkid" },
    { name: "Arsh Goyal Real", email: "arsh.real@gmail.com", handle: "@ArshGoyal", yt: "@ArshGoyal" },
    { name: "Codebasics Real", email: "code.real@gmail.com", handle: "@codebasics", yt: "@codebasics" },
    { name: "Raj Shamani Real", email: "raj.real@gmail.com", handle: "@rajshamani", yt: "@rajshamani" }
];

async function seed() {
    try {
        console.log('Connecting...');
        await mongoose.connect(uri);
        console.log('Connected.');

        for (const data of realCreators) {
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

            const profile = await InfluencerProfile.findOne({ userId: user._id });
            if (!profile) {
                await InfluencerProfile.create({
                    userId: user._id,
                    name: data.name,
                    handle: data.handle,
                    youtube: data.yt, // The key for our Spark Sync
                    setupComplete: true
                });
                console.log(`✅ Seeded: ${data.name}`);
            }
        }

        console.log('\n✅ 10 REAL CREATORS ADDED TO DATABASE');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
