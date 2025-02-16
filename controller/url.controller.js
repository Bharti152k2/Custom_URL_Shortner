import shortid from 'shortid';
import Url from '../models/url.model.js';

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
export { urlShortener };


