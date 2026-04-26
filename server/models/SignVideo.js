const mongoose = require("mongoose");

const signVideoSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

signVideoSchema.index({ word: 1 });

module.exports = mongoose.model("SignVideo", signVideoSchema);
