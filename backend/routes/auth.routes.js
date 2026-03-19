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
      ...otherDetails
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
// @desc    Login user via email & password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

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
// @desc    Login or register via Google
router.post('/google', async (req, res) => {
  try {
    const { credential, role } = req.body; // Role needed if it's their first time

    // In a real scenario with a real GOOGLE_CLIENT_ID, verify the token:
    // const ticket = await client.verifyIdToken({
    //   idToken: credential,
    //   audience: process.env.GOOGLE_CLIENT_ID
    // });
    // const payload = ticket.getPayload();
    
    // MOCK VERIFICATION for now since we may not have a real client ID:
    // We expect the frontend to decode the JWT and send email/name in dev mode if we bypass real verification
    const decodedPayload = jwt.decode(credential);
    if (!decodedPayload || !decodedPayload.email) {
      return res.status(400).json({ message: 'Invalid Google Token' });
    }

    const { email, name, picture } = decodedPayload;

    let user = await User.findOne({ email });

    if (!user) {
      if (!role) {
         return res.status(400).json({ message: 'Role is required for new users', needsRole: true });
      }
      
      // Create new Google User
      user = new User({
        email,
        name,
        role,
        avatar: picture || '',
      });
      await user.save();
    }

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
