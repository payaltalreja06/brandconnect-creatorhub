const mongoose = require('mongoose');
const User = require('./backend/models/User');

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/collabhub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const users = await User.find({}).select('email role profile.socials brand.website signupCompleted');

    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
      console.log(`  Signup completed: ${user.signupCompleted}`);
      if (user.role === 'influencer' && user.profile?.socials) {
        console.log(`  Socials: ${JSON.stringify(user.profile.socials)}`);
      }
      if (user.role === 'brand' && user.brand) {
        console.log(`  Website: ${user.brand.website}`);
      }
      console.log('');
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();