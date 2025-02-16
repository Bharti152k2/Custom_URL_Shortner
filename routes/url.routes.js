const express = require("express");
const {
  urlShortener,
  getShortUrl,
} = require("../controller/url.controller.js");

const router = express.Router();

router.post("/shorten", urlShortener);
router.get("/shorten/:alias", getShortUrl);

module.exports = router;
