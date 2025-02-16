import shortid from "shortid";
import Url from "../models/url.model.js";
/**
 * @swagger
 * /api/shorten:
 *   get:
 *     summary: Get overall analytics
 *     description: Retrieve analytics for all short URLs created by the authenticated user.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUrls:
 *                   type: integer
 *                   example: 5
 *                 totalClicks:
 *                   type: integer
 *                   example: 20
 *                 uniqueUsers:
 *                   type: integer
 *                   example: 10
 *       401:
 *         description: Unauthorized - Invalid token.
 *       500:
 *         description: Internal Server Error.
 */
const urlShortener = async (req, res) => {
  try {
    const { longUrl, customAlias, topic } = req.body;
    const alias = customAlias || shortid.generate();
    const shortUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/shorten/${alias}`;

    const newUrl = new Url({
      longUrl,
      shortUrl,
      customAlias: alias,
      topic,
      createdBy: req.user.id,
    });

    await newUrl.save();
    res.json({ shortUrl, createdAt: newUrl.createdAt });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const getShortUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ customAlias: req.params.alias });
    if (!url) return res.status(404).json({ message: "Not Found" });
    const userAgent = req.headers["user-agent"];
    const os = userAgent.includes("Windows")
      ? "Windows"
      : userAgent.includes("Mac")
      ? "macOS"
      : "Other";
    const device = userAgent.includes("Mobile") ? "Mobile" : "Desktop";
    url.clicks.push({
      timestamp: new Date(),
      userAgent,
      ip: req.ip,
      os,
      device,
    });
    await url.save();
    res.redirect(url.longUrl);
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export { urlShortener, getShortUrl };
