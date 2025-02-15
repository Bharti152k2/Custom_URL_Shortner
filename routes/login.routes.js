const express = require("express");
const passport = require("passport");
const {
  googleAuth,
  googleAuthCallback,
  getProfile,
} = require("../controller/login.contoller");

const router = express.Router();

// Google OAuth Routes
router.get("/google", googleAuth);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback
);

// Protected Route
router.get("/profile", getProfile);

module.exports = router;
