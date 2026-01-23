const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = 3000;

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const server = http.createServer((req, res) => {
  // Set CORS headers to allow cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle root path
  let filePath = req.url === "/" ? "/nutriplan.html" : req.url;
  filePath = path.join(__dirname, filePath);

  // Prevent directory traversal attacks
  const realPath = path.resolve(filePath);
  const baseDir = path.resolve(__dirname);

  if (!realPath.startsWith(baseDir)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Access Denied");
    return;
  }

  // Log request
  console.log(`📄 Request: ${req.url}`);
  console.log(`📁 File: ${filePath}`);

  // Read and serve files
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(`❌ Error: ${err.message}`);
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 - File Not Found: " + filePath);
      return;
    }

    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
    };

    const contentType = contentTypes[ext] || "text/plain";
    res.writeHead(200, { 
      "Content-Type": contentType,
      "Cache-Control": "no-cache"
    });
    console.log(`✅ Served: ${req.url} (${data.length} bytes)`);
    res.end(data);
  });
});

const localIP = getLocalIP();

server.listen(PORT, "0.0.0.0", () => {
  console.log("\n" + "=".repeat(50));
  console.log("🥗 NutriPlan Server Started Successfully!");
  console.log("=".repeat(50));
  console.log("\n📂 Server Directory: " + __dirname);
  console.log("\n🌐 Access the website at:\n");
  console.log(`   Local:    http://localhost:${PORT}`);
  console.log(`   Network:  http://${localIP}:${PORT}`);
  console.log("\n📱 Share the Network URL with other devices!");
  console.log("\n⏹️  Press Ctrl+C to stop the server\n");
  console.log("Waiting for requests...\n");
});

// Error handling
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error("Try closing other applications using this port.");
    console.error("Or change the PORT variable in server.js\n");
  } else {
    console.error("\n❌ Server error:", err, "\n");
  }
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("\n❌ Uncaught Exception:", err, "\n");
  process.exit(1);
});
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Try another port.`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});
