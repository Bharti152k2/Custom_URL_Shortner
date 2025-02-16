const express = require("express");
const {
  urlShortener,
  getShortUrl,
} = require("../controller/url.controller.js");

const router = express.Router();

router.post("/", urlShortener);
router.get("/:alias", getShortUrl);

module.exports = router;
