#!/usr/bin/env node

/**
 * Clear all users from MongoDB
 * Use this to reset the database for fresh start
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function clearDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/", {
      family: 4,
    });

    console.log("✅ Connected to MongoDB");

    console.log("🗑️  Clearing all users...");
    const result = await User.deleteMany({});

    console.log(`✅ Deleted ${result.deletedCount} user(s) from database`);
    console.log("\n📝 Database is now clear!");
    console.log("   Next: Register a fresh admin account at http://localhost:5173\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

clearDatabase();
