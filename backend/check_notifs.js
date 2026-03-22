const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Notification = require('./models/Notification');
const User = require('./models/User');

dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({}, 'name email role');
    console.log('--- USERS ---');
    users.forEach(u => console.log(`${u._id} | ${u.name} | ${u.email}`));

    const notifs = await Notification.find({});
    console.log('\n--- NOTIFICATIONS ---');
    notifs.forEach(n => {
        const user = users.find(u => u._id.toString() === n.userId.toString());
        console.log(`To: ${user?.name || 'UNKNOWN'} (${n.userId}) | From: ${n.fromName} | Type: ${n.type} | Msg: ${n.title}`);
    });
    process.exit(0);
}

check();
