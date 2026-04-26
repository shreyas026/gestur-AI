require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const SignVideo = require('./models/SignVideo');

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔌 MongoDB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

async function seedDB() {
  try {
    const videosPath = path.join(__dirname, 'videos');

    const files = fs.readdirSync(videosPath);

    const videoFiles = files.filter(file => file.endsWith('.mp4'));

    if (videoFiles.length === 0) {
      console.log("❌ No videos found");
      return;
    }

    // 🔥 DELETE OLD DATA
    await SignVideo.deleteMany();
    console.log("🗑 Old data deleted");

    // 🔥 INSERT NEW DATA
    const data = videoFiles.map(file => ({
      word: file.replace('.mp4', '').toUpperCase(),
      videoUrl: `/videos/${file}`
    }));

    await SignVideo.insertMany(data);

    console.log(`✅ Inserted ${data.length} videos`);

    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDB();