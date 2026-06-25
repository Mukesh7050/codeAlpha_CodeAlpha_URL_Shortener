const express = require("express");
const { nanoid } = require("nanoid");
const Url = require("../models/Url");

const router = express.Router();

// Home API
router.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

// Shorten URL
router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    // URL Validation
    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid URL",
      });
    }

    // Duplicate Check
    const existing = await Url.findOne({ originalUrl });

    if (existing) {
      return res.json({
        success: true,
        shortUrl: `${req.protocol}://${req.get("host")}/${existing.shortCode}`,
      });
    }

    // Generate Short Code
    const shortCode = nanoid(7);

    const url = await Url.create({
      originalUrl,
      shortCode,
    });

    res.json({
      success: true,
      shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Redirect
router.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({
      shortCode: req.params.code,
    });

    if (!url) {
      return res.status(404).send("URL Not Found");
    }

    res.redirect(url.originalUrl);

  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;