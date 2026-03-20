const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'mock-client-id');
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

// Helper to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/signup
// @desc    Register a new user (Influencer or Brand)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role, name, ...otherDetails } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      email,
      passwordHash,
      role,
      name,
      ...otherDetails,
      signupCompleted: true // Mark as completed signup
    });

    await newUser.save();
    const token = generateToken(newUser);

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user via email & password or Google OAuth
router.post('/login', async (req, res) => {
  try {
    const { email, password, credential } = req.body;

    // Handle Google OAuth login
    if (credential) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        return res.status(400).json({ message: 'Invalid Google token' });
      }

      const googleEmail = payload.email;
      const user = await User.findOne({ email: googleEmail });

      if (!user) {
        return res.status(400).json({ message: 'Account not found. Please sign up first.' });
      }

      // Check if signup is completed
      if (!user.signupCompleted) {
        return res.status(400).json({
          message: 'Please complete your signup process first.',
          incompleteSignup: true
        });
      }

      // Check profile completeness for additional security
      if (user.role === 'influencer') {
        const hasSocials = user.profile?.socials?.instagram || user.profile?.socials?.tiktok || user.profile?.socials?.youtube;
        if (!hasSocials) {
          return res.status(400).json({
            message: 'Please complete your profile first. Visit the signup page to add your social media handles.',
            incompleteProfile: true
          });
        }
      } else if (user.role === 'brand') {
        if (!user.brand?.website) {
          return res.status(400).json({
            message: 'Please complete your profile first. Visit the signup page to add your website.',
            incompleteProfile: true
          });
        }
      }

      // User has completed signup and has complete profile, allow login
      const token = generateToken(user);
      return res.json({ token, user });
    }

    // Handle regular email/password login
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user || !user.passwordHash) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/google
// @desc    Register new user via Google OAuth (signup only)
router.post('/google', async (req, res) => {
  try {
    const { credential, role, profile, brand } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Missing Google credential token' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    const { email, name, picture } = payload;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'Account already exists. Please use the login page instead.',
        accountExists: true
      });
    }

    // New user - require signup data
    if (!role) {
      return res.status(400).json({ message: 'Role is required for new users', needsRole: true });
    }

    const userData = {
      email,
      name: name || '',
      role,
      avatar: picture || '',
      signupCompleted: true // Mark as completed signup
    };

    // Add additional profile data if provided
    if (profile) {
      userData.profile = profile;
    }
    if (brand) {
      userData.brand = brand;
    }

    const user = new User(userData);
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
