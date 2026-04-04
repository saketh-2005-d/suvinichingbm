const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

// Routes
const clothesRoutes = require("./routes/clothes");
const wishlistRoutes = require("./routes/wishlist");
const whatsappRoutes = require("./routes/whatsapp");

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI;

if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.log("❌ MongoDB connection error:", err));
} else {
  console.log(
    "⚠️ MONGODB_URI is not set. Configure it in environment variables.",
  );
}

// Middleware
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Fail fast for API routes that require DB when MongoDB is disconnected.
app.use("/api", (req, res, next) => {
  if (req.path === "/health") {
    return next();
  }

  // Allow GET requests to degrade gracefully in route handlers.
  if (req.method === "GET") {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "Database not connected. Check MongoDB Atlas Network Access (IP whitelist) and MONGODB_URI in Vercel.",
    });
  }

  return next();
});

// Routes
app.use("/api/clothes", clothesRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running",
    status: "OK",
    dbState: mongoose.connection.readyState,
  });
});

app.get("/", (req, res) => {
  res.json({
    service: "Suvini Backend API",
    health: "/api/health",
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Only listen locally (not on Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `✅ Suvini Clothing Backend Server running on http://localhost:${PORT}`,
    );
  });
}

// Export for Vercel
module.exports = app;
