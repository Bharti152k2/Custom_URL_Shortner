const express = require("express");
require("dotenv").config();
const connectDB = require("./database/connectDB");
const setupSwagger = require("./swagger");
const routes = require("./routes/login.routes.js");
let app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});
app.use("/api", routes);
const PORT = process.env.PORT;
let server = async () => {
  try {
    await connectDB();
    console.log("MongoDB Atlas connected successfully");
    app.listen(PORT, () => {
      console.log(`The application is running on port ${PORT}`);
    });
    setupSwagger(app);
  } catch (error) {
    console.log(error);
  }
};
server();
module.exports = app;
