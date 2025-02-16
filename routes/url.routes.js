const express = require("express");
const {
  urlShortener,
  getShortUrl,
} = require("../controller/url.controller.js");

const router = express.Router();
/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a short URL
 *     description: Generates a short URL from a given long URL.
 *     tags: [URL Shortener]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 example: "https://example.com/some-long-url"
 *               customAlias:
 *                 type: string
 *                 example: "my-custom-alias"
 *               topic:
 *                 type: string
 *                 example: "Tech"
 *     responses:
 *       200:
 *         description: Successfully created short URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: "http://short.ly/my-custom-alias"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-02-16T12:00:00Z"
 *       400:
 *         description: Bad request - Invalid input data.
 *       500:
 *         description: Internal Server Error.
 */

router.post("/", urlShortener);
/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to the original URL
 *     description: Fetches the original URL for a given short alias and redirects the user.
 *     tags: [URL Shortener]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The short alias of the URL.
 *     responses:
 *       302:
 *         description: Redirects to the original URL.
 *       404:
 *         description: URL not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get("/:alias", getShortUrl);

module.exports = router;
