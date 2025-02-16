const mongoose = require("mongoose");
const UrlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  customAlias: String,
  topic: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  clicks: [
    {
      timestamp: Date,
      userAgent: String,
      ip: String,
      os: String,
      device: String,
    },
  ],
});
module.exports = mongoose.model("Url", UrlSchema);
