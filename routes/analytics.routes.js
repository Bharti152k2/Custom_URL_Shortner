const express = require("express");
const {
  getShortUrlAnalytics,
  getTopicBasedAnalytics,
  getOverallAnalytics,
} = require("../controller/analytics.controller.js");

const router = express.Router();

router.get("/:alias", getShortUrlAnalytics);
router.get("/topic/:topic/:alias", getTopicBasedAnalytics);
router.get("/overall", getOverallAnalytics);

module.exports = router;
