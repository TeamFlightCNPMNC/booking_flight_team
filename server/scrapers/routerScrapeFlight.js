const { scrapeFlight } = require("./scrapeFlight.js");
const express = require("express");
const router = express.Router();

router.post("/api/realflight", async (req, res) => {
  try {
    const { flightUrl } = req.body;
    if (!flightUrl) {
      return res.status(400).json({ error: "URL không hợp lệ." });
    }

    const regex = /(\d{8})-?(\d{8})?/;
    const match = flightUrl.match(regex);
    let departureDate, returnDate;
    if (match) {
      departureDate = match[1];
      returnDate = match[2] || null;
    }

    const flightsData = await scrapeFlight(flightUrl);

    res.status(200).json({ flightsData });
  } catch (error) {
    console.error("Scraping failed:", error);
    res.status(500).json({ error: "ServerError" });
  }
});

module.exports = router;
