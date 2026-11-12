const express = require('express');
const { auth, requireRole } = require('../middleware/auth');
const BrandProfile = require('../models/BrandProfile');
const mongoose = require('mongoose');
const { profileSlugPattern } = require('../utils/profileSlug');

const router = express.Router();

// GET /api/brands — list all brands
router.get('/', async (req, res) => {
  try {
    const profiles = await BrandProfile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/brands/me
router.get('/me', auth, requireRole('brand'), async (req, res) => {
  try {
    const profile = await BrandProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Brand profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/brands/:id
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let profile = null;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      profile = await BrandProfile.findById(identifier);
      if (!profile) profile = await BrandProfile.findOne({ userId: identifier });
    } else {
      const slugPattern = profileSlugPattern(identifier);
      if (slugPattern) profile = await BrandProfile.findOne({ name: slugPattern });
    }
    if (!profile) return res.status(404).json({ message: 'Brand not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/brands/me — update own brand profile
router.put('/me', auth, requireRole('brand'), async (req, res) => {
  try {
    const allowed = ['name', 'logo', 'domain', 'description', 'industry', 'budget', 'website', 'contactEmail', 'avatar', 'faqs'];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    updates.updatedAt = new Date();

    const profile = await BrandProfile.findOneAndUpdate(
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
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
