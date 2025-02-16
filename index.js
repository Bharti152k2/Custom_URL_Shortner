const express = require("express");
require("dotenv").config();
const connectDB = require("./database/connectDB");
const setupSwagger = require("./swagger");
const session = require("express-session");
const authRoutes = require("./routes/login.routes.js");
const urlRoutes = require("./routes/url.routes.js");
const passport = require("./passportConfig.js");
const { authenticate } = require("./middlewares/auth.js");
const { limiter } = require("./middlewares/rateLimit.js");

let app = express();
app.use(express.json());
app.use(passport.initialize());

app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

app.use("/auth", authRoutes);
app.use(
  "/api",
  authenticate,
  limiter,
  (req, res, next) => {
    console.log("Token inside API Route:", req.token); // Log token
    next();
  },
  urlRoutes
);
// app.use('/api/analytics', analyticsRoutes);
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
