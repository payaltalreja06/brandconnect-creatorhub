const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { 
    type: String, 
    required: function() { return !this.googleId; }, 
    minlength: 6 
  },
  googleId: { type: String, default: null },
  role: { type: String, enum: ['influencer', 'brand'], default: 'influencer' },
  avatar: { type: String, default: '' },
  setupComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function () {
  if (!this.password || !this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
