import shortid from "shortid";
import Url from "../models/url.model.js";

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
