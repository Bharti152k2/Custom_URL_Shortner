const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(
    "mongodb+srv://Bharti:Nirankar%4015@customurlshortner.e8n7h.mongodb.net/?retryWrites=true&w=majority&appName=customUrlShortner"
  );
};
module.exports = connectDB; 
