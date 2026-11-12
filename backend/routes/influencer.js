const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const InfluencerProfile = require('../models/InfluencerProfile');
const { normalizeYoutubeChannelId } = require('../utils/youtube');
const { profileSlugPattern } = require('../utils/profileSlug');
const mongoose = require('mongoose');

const router = express.Router();

// GET /api/influencers — list all influencer profiles
router.get('/', async (req, res) => {
  try {
    const { search, domain, sortBy } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { handle: { $regex: search, $options: 'i' } },
      ];
    }
    if (domain && domain !== 'all') {
      query.domain = { $in: [domain] };
    }
    let sort = {};
    if (sortBy === 'engagement') sort = { engagement: -1 };
    else if (sortBy === 'health') sort = { healthScore: -1 };
    else sort = { followers: -1 };

    const profiles = await InfluencerProfile.find(query).sort(sort);
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/influencers/me — current influencer's own profile
router.get('/me', auth, requireRole('influencer'), async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/influencers/:id — get by profile _id or userId
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let profile = null;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      profile = await InfluencerProfile.findById(identifier);
      if (!profile) profile = await InfluencerProfile.findOne({ userId: identifier });
    } else {
      const slugPattern = profileSlugPattern(identifier);
      if (slugPattern) {
        profile = await InfluencerProfile.findOne({
          $or: [{ handle: slugPattern }, { name: slugPattern }],
        });
      }
    }
    if (!profile) return res.status(404).json({ message: 'Influencer not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/influencers/me — update own profile
router.put('/me', auth, requireRole('influencer'), async (req, res) => {
  try {
    const allowed = [
      'name', 'handle', 'bio', 'location', 'domain', 'platforms',
      'rate', 'price', 'contentType', 'gender', 'age', 'language',
      'avatar', 'coverImage', 'website', 'instagram', 'tiktok',
      'faqs',
    ];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const unset = {};
    if (req.body.youtube !== undefined) {
      let channelId;
      try {
        channelId = normalizeYoutubeChannelId(req.body.youtube);
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }

      if (channelId) {
        const existingChannel = await InfluencerProfile.findOne({
          userId: { $ne: req.user._id },
          $or: [
            { youtubeChannelId: channelId },
            { youtube: channelId },
            { youtube: `https://www.youtube.com/channel/${channelId}` },
            { youtube: `https://youtube.com/channel/${channelId}` },
            { youtube: `youtube.com/channel/${channelId}` },
          ],
        });
        if (existingChannel) {
          return res.status(409).json({ message: 'This YouTube channel is already linked to another account.' });
        }
        updates.youtube = channelId;
        updates.youtubeChannelId = channelId;
      } else {
        updates.youtube = '';
        unset.youtubeChannelId = 1;
      }
    }

    updates.updatedAt = new Date();

    const profile = await InfluencerProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: updates,
        ...(Object.keys(unset).length ? { $unset: unset } : {}),
      },
      { new: true, upsert: true }
    );

    // If setupComplete is sent, update user as well
    if (req.body.setupComplete) {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, { $set: { setupComplete: true } });
    }

    res.json(profile);
  } catch (err) {
    console.error('Update influencer profile error:', err);
    if (err.code === 11000 && err.keyPattern?.youtubeChannelId) {
      return res.status(409).json({ message: 'This YouTube channel is already linked to another account.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/influencers/me/faqs — update FAQs only
router.put('/me/faqs', auth, requireRole('influencer'), async (req, res) => {
  try {
    const { faqs } = req.body;
    if (!Array.isArray(faqs)) {
      return res.status(400).json({ message: 'faqs must be an array' });
    }
    const profile = await InfluencerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { faqs, updatedAt: new Date() } },
      { new: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
