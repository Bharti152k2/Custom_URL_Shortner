const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided or incorrect format" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  if (!token) {
    return res.status(401).json({ message: "Token format incorrect" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Invalid Token", error: err.message });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { authenticate };
