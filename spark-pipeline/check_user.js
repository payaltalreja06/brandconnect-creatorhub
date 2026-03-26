
const mongoose = require('mongoose');
require('dotenv').config({ path: '../backend/.env' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await mongoose.connection.db.collection('users').findOne({ name: /Nishant Chahar/i });
  console.log('User:', user);
  if (user) {
    const profile = await mongoose.connection.db.collection('influencerprofiles').findOne({ userId: user._id });
    console.log('Profile:', profile);
  }
  await mongoose.disconnect();
}

check();
