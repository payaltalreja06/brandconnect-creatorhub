const mongoose = require('mongoose');

const SocialsSchema = new mongoose.Schema({
  youtube: { type: String, default: "" },
  instagram: { type: String, default: "" },
  tiktok: { type: String, default: "" }
});

const ProfileSchema = new mongoose.Schema({
  domains: { type: [String], default: [] },
  platforms: { type: [String], default: [] },
  followers: { type: Number, default: 0 },
  engagementRate: { type: Number, default: 0 },
  rateMin: { type: Number, default: 0 },
  rateMax: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  healthScore: { type: Number, default: 0 },
  socials: { type: SocialsSchema, default: () => ({}) }
});

const BrandSubSchema = new mongoose.Schema({
  industry: { type: String, default: "" },
  domain: { type: String, default: "" },
  budget: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  website: { type: String, default: "" },
  contactEmail: { type: String, default: "" },
  campaignsCount: { type: Number, default: 0 }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String }, // Optional for Google OAuth users
  role: { type: String, enum: ['influencer', 'brand'], required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: "" },
  handle: { type: String, default: "" },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  status: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' },
  settings: {
    language: { type: String, default: "en" },
    notificationsEnabled: { type: Boolean, default: true }
  },
  profile: { type: ProfileSchema, default: () => ({}) }, // Only used if role === 'influencer'
  brand: { type: BrandSubSchema, default: () => ({}) }   // Only used if role === 'brand'
}, { timestamps: true });

UserSchema.index({ role: 1 });
UserSchema.index({ handle: 1 });
UserSchema.index({ status: 1 });

module.exports = mongoose.model('User', UserSchema);
