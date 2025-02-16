const express = require("express");
const {
  getShortUrlAnalytics,getTopicBasedAnalytics
} = require("../controller/analytics.controller.js");

const router = express.Router();

router.get("/analytics/:alias", getShortUrlAnalytics);
router.get("/analytics/topic/:topic/:alias", getTopicBasedAnalytics);

module.exports = router;
