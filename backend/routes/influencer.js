const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const InfluencerProfile = require('../models/InfluencerProfile');

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
router.get('/:id', async (req, res) => {
  try {
    let profile = await InfluencerProfile.findById(req.params.id).catch(() => null);
    if (!profile) {
      profile = await InfluencerProfile.findOne({ userId: req.params.id });
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
      'avatar', 'coverImage', 'website', 'instagram', 'youtube', 'tiktok',
      'faqs',
    ];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    updates.updatedAt = new Date();

    const profile = await InfluencerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
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
