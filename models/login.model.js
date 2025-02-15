const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  googleId: String, // Store Google OAuth ID
  profilePicture: String,
  createdAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model("User", UserSchema);
