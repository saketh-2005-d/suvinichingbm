const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

// Routes
const clothesRoutes = require("./routes/clothes");
const wishlistRoutes = require("./routes/wishlist");
const whatsappRoutes = require("./routes/whatsapp");

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI;
const mongooseConnectOptions = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 10,
};

if (mongoUri) {
  if (!mongoUri.startsWith("mongodb+srv://")) {
    console.log(
      "⚠️ Consider using Atlas mongodb+srv URI in production for better DNS routing.",
    );
  }

  mongoose
    .connect(mongoUri, mongooseConnectOptions)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => {
      console.log("❌ MongoDB connection error:", err.message || err);
      if (err?.reason?.type) {
        console.log("❌ MongoDB topology error:", err.reason.type);
      }
    });
} else {
  console.log(
    "⚠️ MONGODB_URI is not set. Configure it in environment variables.",
  );
}

// Middleware
const corsOptions = {
  origin: (_origin, callback) => callback(null, true),
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Fail fast for API routes that require DB when MongoDB is disconnected.
app.use("/api", (req, res, next) => {
  if (req.path === "/health") {
    return next();
  }

  // Allow GET requests to degrade gracefully in route handlers.
  if (req.method === "GET") {
    return next();
  }

  // Allow clothes write routes to run local fallback storage when DB is down.
  if (req.path.startsWith("/clothes")) {
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
