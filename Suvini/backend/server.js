const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Routes
const clothesRoutes = require("./routes/clothes");
const wishlistRoutes = require("./routes/wishlist");
const whatsappRoutes = require("./routes/whatsapp");

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || "mongodb+srv://suviniclothing:surekhasravan@cluster0.qtq0z3l.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

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

// Routes
app.use("/api/clothes", clothesRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running", status: "OK" });
});

// Serve client index.html for SPA routing (catch-all)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
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
