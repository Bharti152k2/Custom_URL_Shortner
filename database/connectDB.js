const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsAllowInvalidCertificates: true,
  });
};
module.exports = connectDB;
