import Url from "../models/url.model.js";
import moment from "moment";
const getShortUrlAnalytics = async (req, res) => {
  try {
    const url = await Url.findOne({
      customAlias: req.params.alias,
      createdBy: req.user.id,
    });

    if (!url) return res.status(404).json({ message: "Not Found" });

    const totalClicks = url.clicks.length;
    const uniqueUsers = new Set(url.clicks.map((click) => click.ip)).size;

    // 📌 1. Clicks by Date (Last 7 Days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = moment().subtract(i, "days").format("YYYY-MM-DD");
      return { date, clickCount: 0 };
    });

    url.clicks.forEach((click) => {
      const clickDate = moment(click.timestamp).format("YYYY-MM-DD");
      const dateEntry = last7Days.find((entry) => entry.date === clickDate);
      if (dateEntry) {
        dateEntry.clickCount += 1;
      }
    });

    // 📌 2. OS Type Breakdown
    const osStats = {};
    url.clicks.forEach((click) => {
      const os = click.os || "Unknown";
      if (!osStats[os]) {
        osStats[os] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }
      osStats[os].uniqueClicks += 1;
      osStats[os].uniqueUsers.add(click.ip);
    });

    const osType = Object.entries(osStats).map(([osName, data]) => ({
      osName,
      uniqueClicks: data.uniqueClicks,
      uniqueUsers: data.uniqueUsers.size,
    }));

    // 📌 3. Device Type Breakdown
    const deviceStats = {};
    url.clicks.forEach((click) => {
      const device = click.device || "Unknown";
      if (!deviceStats[device]) {
        deviceStats[device] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }
      deviceStats[device].uniqueClicks += 1;
      deviceStats[device].uniqueUsers.add(click.ip);
    });

    const deviceType = Object.entries(deviceStats).map(
      ([deviceName, data]) => ({
        deviceName,
        uniqueClicks: data.uniqueClicks,
        uniqueUsers: data.uniqueUsers.size,
      })
    );

    // ✅ Response
    res.json({
      totalClicks,
      uniqueUsers,
      clicksByDate: last7Days,
      osType,
      deviceType,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export { getShortUrlAnalytics };
