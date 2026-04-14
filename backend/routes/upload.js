const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const InfluencerProfile = require('../models/InfluencerProfile');
const BrandProfile = require('../models/BrandProfile');

const router = express.Router();

/*
// Cloudinary Configuration (For Production)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'collaborix/avatars',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});
*/

// Primary Storage: Local (As requested for now)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST /api/upload/avatar
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Default to local path
    const avatarUrl = `/uploads/${req.file.filename}`;

    // Update models
    await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl });
    
    if (req.user.role === 'influencer') {
      await InfluencerProfile.findOneAndUpdate(
        { userId: req.user._id },
        { avatar: avatarUrl }
      );
    } else if (req.user.role === 'brand') {
      await BrandProfile.findOneAndUpdate(
        { userId: req.user._id },
        { avatar: avatarUrl }
      );
    }

    res.json({ avatarUrl, message: 'Avatar updated locally!' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to upload photo' });
  }
});

// DELETE /api/upload/avatar
router.delete('/avatar', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Clear fields in database
    await User.findByIdAndUpdate(req.user._id, { avatar: '' });
    
    if (req.user.role === 'influencer') {
      await InfluencerProfile.findOneAndUpdate({ userId: req.user._id }, { avatar: '' });
    } else if (req.user.role === 'brand') {
      await BrandProfile.findOneAndUpdate({ userId: req.user._id }, { avatar: '' });
    }

    res.status(200).json({ message: 'Avatar removed' });
  } catch (err) {
    console.error('Remove avatar error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
