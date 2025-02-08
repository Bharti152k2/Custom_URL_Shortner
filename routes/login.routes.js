const express = require("express");
const { register, login } = require("../controller/login.contoller");
let router = express.Router();
router.post("/signup", register);
router.get("/signin", login);
module.exports = router;
