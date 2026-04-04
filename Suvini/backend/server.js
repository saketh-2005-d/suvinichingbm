const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

// Routes
const clothesRoutes = require("./routes/clothes");
const wishlistRoutes = require("./routes/wishlist");
const whatsappRoutes = require("./routes/whatsapp");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from client folder
app.use(express.static(path.join(__dirname, "..", "client")));

// Serve admin folder
app.use("/admin", express.static(path.join(__dirname, "..", "admin")));

// Initialize data files if they don't exist
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const clothesFile = path.join(dataDir, "clothes.json");
const wishlistFile = path.join(dataDir, "wishlist.json");

if (!fs.existsSync(clothesFile)) {
  fs.writeFileSync(clothesFile, JSON.stringify([], null, 2));
}

if (!fs.existsSync(wishlistFile)) {
  fs.writeFileSync(wishlistFile, JSON.stringify([], null, 2));
}

// Routes
app.use("/api/clothes", clothesRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running", status: "OK" });
});

// Default fallback route
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
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
