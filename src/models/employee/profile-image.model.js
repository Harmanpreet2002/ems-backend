const mongoose = require("mongoose");

const profileImageSchema = mongoose.Schema({
  employeeId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const ProfileImage = mongoose.model("ProfileImage", profileImageSchema);

module.exports = ProfileImage;
