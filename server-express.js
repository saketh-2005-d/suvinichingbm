#!/usr/bin/env node
/**
 * NutriPlan Express Server - Faster Alternative
 * Run: npm install express
 * Then: node server-express.js
 */

const express = require("express");
const os = require("os");
const path = require("path");

const app = express();
const PORT = 3000;

// Get local IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

// Middleware
app.use(express.static(path.join(__dirname)));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "nutriplan.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("404 - File Not Found");
});

// Start server
const localIP = getLocalIP();

app.listen(PORT, "0.0.0.0", () => {
  console.log("\n" + "=".repeat(50));
  console.log("🥗 NutriPlan Express Server Started!");
  console.log("=".repeat(50));
  console.log("\n📂 Server Directory: " + __dirname);
  console.log("\n🌐 Access the website at:\n");
  console.log(`   Local:    http://localhost:${PORT}`);
  console.log(`   Network:  http://${localIP}:${PORT}`);
  console.log("\n📱 Share the Network URL with other devices!");
  console.log("\n⏹️  Press Ctrl+C to stop the server\n");
});
