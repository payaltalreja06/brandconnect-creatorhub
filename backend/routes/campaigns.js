const express = require('express');
const { auth } = require('../middleware/auth');
const Campaign = require('../models/Campaign');

const router = express.Router();

// GET /api/campaigns
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'brand') query.brandId = req.user._id;
    else if (req.user.role === 'influencer') query.influencerId = req.user._id;
    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/campaigns
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, deliverables, budget, deadline, influencerId, influencerName } = req.body;
    const campaign = new Campaign({
      brandId: req.user._id,
      brandName: req.user.name,
      brandLogo: '🏢',
      influencerId: influencerId || null,
      influencerName: influencerName || '',
      title,
      description: description || '',
      deliverables: deliverables || [],
      budget: budget || '',
      deadline: deadline || '',
      status: 'pending',
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/campaigns/:id/status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
