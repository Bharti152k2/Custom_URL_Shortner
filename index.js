const express = require("express");
require("dotenv").config();
const connectDB = require("./database/connectDB");
const setupSwagger = require("./swagger");
const session = require("express-session");
const routes = require("./routes/login.routes.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/login.model.js");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

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
// Passport Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
      }
      done(null, user);
    }
  )
);

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
// Google Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    res.json({ token, user: req.user });
  }
);

// Protected route
app.get("/profile", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
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
