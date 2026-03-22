const express = require('express');
const { auth } = require('../middleware/auth');
const Analytics = require('../models/Analytics');

const router = express.Router();

// GET /api/analytics/me — get analytics for current user
router.get('/me', auth, async (req, res) => {
  try {
    const analytics = await Analytics.findOne({ userId: req.user._id });
    if (!analytics) return res.status(404).json({ message: 'Analytics not found' });
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/analytics/:userId — get analytics for specific user (public)
router.get('/:userId', async (req, res) => {
  try {
    const analytics = await Analytics.findOne({ userId: req.params.userId });
    if (!analytics) return res.status(404).json({ message: 'Analytics not found' });
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
