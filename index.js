const express = require("express");
const connectDB = require("./database/connectDB");
let app = express();
app.use(express.json());
app.use("/", () => {
  console.log("Server is running");
});
let server = async () => {
  try {
    await connectDB();
    console.log("MongoDB Atlas connected successfully");
    app.listen(5001, () => {
      console.log("The application is running on port 5001");
    });
  } catch (error) {
    console.log(error);
  }
};
server();
module.exports = app;