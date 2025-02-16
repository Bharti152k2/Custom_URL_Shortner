const express = require("express");
const { urlShortener } = require("../controller/url.controller.js");

const router = express.Router();

router.post("/shorten", urlShortener);

module.exports = router;
