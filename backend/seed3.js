const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const InfluencerProfile = require('./models/InfluencerProfile');
const BrandProfile = require('./models/BrandProfile');
const Analytics = require('./models/Analytics');
const Campaign = require('./models/Campaign');
const Notification = require('./models/Notification');
const CollabRequest = require('./models/CollabRequest');

dotenv.config();

const uri = "mongodb+srv://payal08:A6bOLU8T0YAkIPZY@cluster0.ez6bp5h.mongodb.net/?appName=Cluster0";

async function runSeed() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(uri);
        
        console.log('Clearing data...');
        await User.deleteMany({});
        await InfluencerProfile.deleteMany({});
        await BrandProfile.deleteMany({});
        await Analytics.deleteMany({});
        await Campaign.deleteMany({});
        await Notification.deleteMany({});
        await CollabRequest.deleteMany({});

        console.log('Seeding Ravi Kumar (Influencer)...');
        const raviUser = await User.create({
            name: "Ravi Kumar", email: "ravi@collabrix.com", password: "password123", role: "influencer",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi", setupComplete: true
        });
        await InfluencerProfile.create({
            userId: raviUser._id, name: "Ravi Kumar", handle: "@techwithravi", location: "Hyderabad", domain: ["Tech"],
             followers: 3200000, engagement: 6.1, ytSubscribers: 2800000, instaFollowers: 400000, rate: "₹1L - ₹2L", healthScore: 91
        });

        console.log('Seeding Priya Sharma (Influencer)...');
        const priyaUser = await User.create({
            name: "Priya Sharma", email: "priya@collabrix.com", password: "password123", role: "influencer",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", setupComplete: true
        });
        await InfluencerProfile.create({
            userId: priyaUser._id, name: "Priya Sharma", handle: "@priyaskincare", location: "Mumbai", domain: ["Skincare"],
            followers: 2400000, engagement: 4.8, ytSubscribers: 1800000, instaFollowers: 600000, rate: "₹80k - ₹1.5L", healthScore: 87
        });

        console.log('Seeding Brand (TechNova)...');
        const techUser = await User.create({
            name: "TechNova", email: "technova@collabrix.com", password: "password123", role: "brand",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TechNova", setupComplete: true
        });
        await BrandProfile.create({
            userId: techUser._id, name: "TechNova", industry: "Technology", website: "technova.in", campaigns: 6, setupComplete: true
        });

        console.log('Adding Correct Notifications...');
        // Notification for Ravi (from TechNova)
        await Notification.create({
            userId: raviUser._id, type: 'collab_request', title: 'New Collaboration Invitation',
            description: 'TechNova invited you to review the new Nova Pro X1',
            fromUserId: techUser._id, fromName: 'TechNova', fromAvatar: techUser.avatar, read: false
        });

        // Notification for TechNova (from Priya - dummy just to verify context)
        await Notification.create({
            userId: techUser._id, type: 'campaign', title: 'Campaign Update',
            description: 'Priya Sharma submitted deliverables for Summer Skincare Launch',
            fromUserId: priyaUser._id, fromName: 'Priya Sharma', fromAvatar: priyaUser.avatar, read: false
        });

        console.log('✅ SEEDING COMPLETED SUCCESSFUL!');
        process.exit(0);
    } catch (err) {
        console.error('ERROR during seed:', err.message);
        process.exit(1);
    }
}

runSeed();
