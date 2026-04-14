const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Load models
const InfluencerProfile = require('../models/InfluencerProfile');
const User = require('../models/User');
const Analytics = require('../models/Analytics');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/collaborix';

async function syncSparkData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const rawDataDir = path.join(__dirname, '../../spark-pipeline/data/yt/raw');
    if (!fs.existsSync(rawDataDir)) {
      console.error('Spark data directory not found:', rawDataDir);
      process.exit(1);
    }

    const folders = fs.readdirSync(rawDataDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    let updatedCount = 0;

    for (const folder of folders) {
      const folderPath = path.join(rawDataDir, folder);
      
      const dates = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .sort()
        .reverse();

      if (dates.length === 0) continue;

      const latestDataPath = path.join(folderPath, dates[0], 'data.json');
      if (!fs.existsSync(latestDataPath)) continue;

      const data = JSON.parse(fs.readFileSync(latestDataPath, 'utf8'));
      const avatarUrl = data.avatar;
      const subCount = data.subscribers || 0;
      const totalViews = data.totalViews || 0;
      const totalVideos = data.totalVideos || 0;

      const nameGuess = folder.replace(/_/g, ' ');
      const handleGuess = folder.replace(/_/g, '').toLowerCase();

      const profile = await InfluencerProfile.findOne({
        $or: [
          { name: new RegExp('^' + nameGuess + '$', 'i') },
          { handle: new RegExp('^@?' + handleGuess + '$', 'i') }
        ]
      });

      if (profile) {
        // 1. Update Profile
        const updateData = {};
        if (avatarUrl) updateData.avatar = avatarUrl;
        if (subCount > 0) {
            updateData.ytSubscribers = subCount;
            updateData.followers = subCount;
            updateData.healthScore = 90; // Defaulting health to 90 for demo creators
        }

        await InfluencerProfile.findByIdAndUpdate(profile._id, updateData);

        if (avatarUrl) {
          await User.findByIdAndUpdate(profile.userId, { avatar: avatarUrl });
        }

        // 2. Update Analytics
        const analyticsUpdate = {
          ytOverview: {
            totalViews,
            subscribers: subCount,
            totalVideos,
            avgWatchTime: "4:32"
          },
          healthScore: 90,
          ytRecentVideos: (data.videos || []).map(v => ({
            videoId: v.videoId,
            title: v.title,
            views: v.views,
            likes: v.likes,
            comments: v.comments,
            date: v.publishedAt
          }))
        };

        await Analytics.findOneAndUpdate(
          { userId: profile.userId },
          { $set: analyticsUpdate },
          { upsert: true }
        );

        console.log(`[SUCCESS] Updated ${profile.name} (Subs: ${subCount}, Videos: ${analyticsUpdate.ytRecentVideos.length})`);
        updatedCount++;
      } else {
        console.warn(`[SKIP] No database profile found for folder: ${folder}`);
      }
    }

    console.log(`\nSync complete. Updated ${updatedCount} profiles.`);
    process.exit(0);
  } catch (err) {
    console.error('Error syncing data:', err);
    process.exit(1);
  }
}

syncSparkData();
