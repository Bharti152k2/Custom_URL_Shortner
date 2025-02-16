const express = require("express");
const {
  getShortUrlAnalytics,
} = require("../controller/analytics.controller.js");

const router = express.Router();

router.get("/analytics/:alias", getShortUrlAnalytics);

module.exports = router;
