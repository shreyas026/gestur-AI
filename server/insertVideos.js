require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const SignVideo = require('./models/SignVideo');

// 🔥 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  family: 4
})
.then(() => console.log("🔌 MongoDB Connected for Insert"))
.catch(err => console.log("❌ DB Error:", err));

async function insertVideos() {
  try {
    const videosPath = path.join(__dirname, 'videos');

    // Read all files in videos folder
    const files = fs.readdirSync(videosPath);

    // Filter only .mp4 files
    const videoFiles = files.filter(file => file.endsWith('.mp4'));

    if (videoFiles.length === 0) {
      console.log("❌ No video files found in /videos folder");
      process.exit();
    }

    // Convert to DB format
    const data = videoFiles.map(file => ({
      word: file.replace('.mp4', '').toUpperCase(),
      videoUrl: `/videos/${file}`
    }));

    // Clear old data (optional but recommended)
    await SignVideo.deleteMany();

    // Insert new data
    await SignVideo.insertMany(data);

    console.log(`✅ Successfully inserted ${data.length} videos`);

    process.exit();

  } catch (error) {
    console.error("❌ Error inserting videos:", error);
    process.exit(1);
  }
}

// Run function
insertVideos();