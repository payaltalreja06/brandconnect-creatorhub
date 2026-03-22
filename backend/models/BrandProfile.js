const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const brandProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  logo: { type: String, default: '🏢' },
  avatar: { type: String, default: '' },
  domain: { type: String, default: '' },
  description: { type: String, default: '' },
  industry: { type: String, default: '' },
  budget: { type: String, default: '' },
  website: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  campaigns: { type: Number, default: 0 },
  faqs: [faqSchema],
  updatedAt: { type: Date, default: Date.now },
});

brandProfileSchema.pre('save', function() {
  this.updatedAt = new Date();
});

module.exports = mongoose.model('BrandProfile', brandProfileSchema);
