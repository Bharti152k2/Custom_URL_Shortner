const express = require("express");
const {
  getShortUrlAnalytics,
  getTopicBasedAnalytics,
  getOverallAnalytics,
} = require("../controller/analytics.controller.js");

const router = express.Router();
/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics for a specific short URL
 *     description: Retrieves analytics for a given short URL, including total clicks, unique users, clicks by date, OS type, and device type.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The custom alias of the short URL.
 *     responses:
 *       200:
 *         description: Analytics data for the specified short URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: number
 *                   example: 10
 *                 uniqueUsers:
 *                   type: number
 *                   example: 5
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2025-02-16"
 *                       clickCount:
 *                         type: number
 *                         example: 3
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                         example: "Windows"
 *                       uniqueClicks:
 *                         type: number
 *                         example: 4
 *                       uniqueUsers:
 *                         type: number
 *                         example: 3
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                         example: "Mobile"
 *                       uniqueClicks:
 *                         type: number
 *                         example: 6
 *                       uniqueUsers:
 *                         type: number
 *                         example: 4
 *       404:
 *         description: URL not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get("/:alias", getShortUrlAnalytics);
/**
 * @swagger
 * /api/analytics/topic/{topic}/{alias}:
 *   get:
 *     summary: Get analytics for a topic-based short URL
 *     description: Retrieves analytics for all short URLs under a specific topic.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: The topic under which the URLs are categorized.
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The custom alias of the short URL.
 *     responses:
 *       200:
 *         description: Analytics data for the topic.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: number
 *                   example: 20
 *                 uniqueUsers:
 *                   type: number
 *                   example: 8
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "2025-02-16"
 *                       clickCount:
 *                         type: number
 *                         example: 6
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       shortUrl:
 *                         type: string
 *                         example: "http://short.ly/example"
 *                       totalClicks:
 *                         type: number
 *                         example: 10
 *                       uniqueUsers:
 *                         type: number
 *                         example: 4
 *       404:
 *         description: No URLs found for the topic.
 *       500:
 *         description: Internal Server Error.
 */
router.get("/topic/:topic/:alias", getTopicBasedAnalytics);
/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics for all user URLs
 *     description: Retrieves total analytics for all short URLs created by the authenticated user.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overall analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUrls:
 *                   type: number
 *                   example: 15
 *                 totalClicks:
 *                   type: number
 *                   example: 100
 *                 uniqueUsers:
 *                   type: number
 *                   example: 50
 *       500:
 *         description: Internal Server Error.
 */
router.get("/overall", getOverallAnalytics);

module.exports = router;
