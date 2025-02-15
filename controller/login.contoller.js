const jwt = require("jsonwebtoken");
const passport = require("passport");

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Google OAuth Authentication Routes
const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

const googleAuthCallback = (req, res) => {
  const token = generateToken(req.user);
  res.json({ token, user: req.user });
};

// Get Profile of Logged-in User
const getProfile = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = {
  googleAuth,
  googleAuthCallback,
  getProfile,
};
