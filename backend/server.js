const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 Page Pulse Backend Running");
});

// Test Route
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend Connected Successfully 🚀",
  });
});

// Audit Route
app.post("/api/audit", async (req, res) => {
  try {
    const { url } = req.body;

    // URL Validation
    if (!url) {
      return res.status(400).json({
        success: false,
        error: "Please enter a website URL.",
      });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        error: "Invalid URL format.",
      });
    }

    const start = Date.now();

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137.0 Safari/537.36",
      },
      validateStatus: () => true,
    });

    const end = Date.now();

   // HTTP Error Check
if (response.status >= 400) {
  return res.status(response.status).json({
    success: false,
    error: `Website returned HTTP ${response.status}`,
  });
}

// Content-Type Check
const contentType = response.headers["content-type"] || "";

if (!contentType.includes("text/html")) {
  return res.status(400).json({
    success: false,
    error: "This URL is not an HTML webpage.",
  });
}


    const $ = cheerio.load(response.data);

    const title = $("title").text().trim() || "No Title";

    const metaDescription =
      $('meta[name="description"]').attr("content") || "No Description";

    const h1Count = $("h1").length;

    const missingAltImages = $("img")
      .filter((i, el) => {
        const alt = $(el).attr("alt");
        return !alt || alt.trim() === "";
      })
      .length;

    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    const wordCount = bodyText ? bodyText.split(" ").length : 0;

    return res.json({
      success: true,
      status: response.status,
      responseTime: `${end - start} ms`,
      title,
      metaDescription,
      h1Count,
      missingAltImages,
      wordCount,
    });

  } catch (error) {

    console.error(error);

    if (error.code === "ECONNABORTED") {
      return res.status(408).json({
        success: false,
        error: "Website took too long to respond.",
      });
    }

    if (error.code === "ENOTFOUND") {
      return res.status(404).json({
        success: false,
        error: "Website not found.",
      });
    }

    if (error.response?.status === 403) {
      return res.status(403).json({
        success: false,
        error: "Website blocked automated requests.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Something went wrong while analyzing the website.",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running : http://localhost:${PORT}`);
});