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

const getTopicBasedAnalytics = async (req, res) => {
  try {

    // Fetch all URLs under the given topic and created by the logged-in user
    const urls = await Url.find({
      topic: req.params.topic,
      createdBy: req.user.id,
    });


    if (urls.length === 0) {
      return res.json({
        totalClicks: 0,
        uniqueUsers: 0,
        clicksByDate: [],
        urls: [],
      });
    }

    // 📌 Total Clicks & Unique Users
    let totalClicks = 0;
    const uniqueUsersSet = new Set();

    // 📌 Clicks by Date (Last 7 Days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = moment().subtract(i, "days").format("YYYY-MM-DD");
      return { date, clickCount: 0 };
    });

    urls.forEach((url) => {
      totalClicks += url.clicks.length;

      url.clicks.forEach((click) => {
        uniqueUsersSet.add(click.ip);

        const clickDate = moment(click.timestamp).format("YYYY-MM-DD");
        const dateEntry = last7Days.find((entry) => entry.date === clickDate);
        if (dateEntry) {
          dateEntry.clickCount += 1;
        }
      });
    });

    // 📌 URLs Breakdown
    const urlsData = urls.map((url) => ({
      shortUrl: url.shortUrl,
      totalClicks: url.clicks.length,
      uniqueUsers: new Set(url.clicks.map((click) => click.ip)).size,
    }));

    // ✅ Send response
    res.json({
      totalClicks,
      uniqueUsers: uniqueUsersSet.size,
      clicksByDate: last7Days,
      urls: urlsData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

export { getShortUrlAnalytics, getTopicBasedAnalytics };
