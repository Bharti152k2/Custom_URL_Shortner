const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Full Authorization Header:", authHeader); // Print the full header

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided or incorrect format" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token
  console.log("Extracted Token:", token); // Print the extracted token

  if (!token) {
    return res.status(401).json({ message: "Token format incorrect" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return res
        .status(401)
        .json({ message: "Invalid Token", error: err.message });
    }
    console.log("Decoded Token:", decoded); // Print decoded token
    req.user = decoded;
    next();
  });
};

module.exports = { authenticate };
