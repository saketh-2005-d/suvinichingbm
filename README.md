# 🥗 NutriPlan - Food Diet Plan System

A comprehensive nutrition and meal planning website powered by Google's Gemini AI.

## 📋 Features

- **BMI Calculator** - Calculate your Body Mass Index with health recommendations
- **Meal Planner** - Generate personalized meal plans
- **AI-Powered Suggestions** - Get customized 7-day diet plans from Gemini AI
- **Recipe Database** - Browse healthy recipes by meal type
- **AI Nutrition Advisor** - Chat with an AI nutritionist
- **Interactive Chat** - Ask dietary questions and get personalized advice

## 🚀 Getting Started

### 🔥 FASTEST METHOD - Run Diagnostics First

1. Go to `c:\codes` folder
2. **Double-click `diagnose.bat`** - This will:
   - Check if files are set up correctly
   - Verify Node.js or Python is installed
   - Check if port 3000 is available
   - Start the server automatically

### Option 1: Run with Node.js (Recommended)

**Prerequisites:** Node.js must be installed on your computer

1. Open Command Prompt/PowerShell in the `codes` folder
2. Run the server:
   ```bash
   node server.js
   ```
3. You'll see:
   ```
   Local:    http://localhost:3000
   Network:  http://192.168.x.x:3000
   ```
4. **Open in browser immediately** (don't wait)

### Option 2: Run with Python

**Prerequisites:** Python 3.x installed on your computer

1. Open Command Prompt/PowerShell in the `codes` folder
2. Run the server:

   ```bash
   python server.py
   ```

   or

   ```bash
   python3 server.py
   ```

3. You'll see the access URLs similar to above

### Option 3: Quick Start (No Installation)

Simply double-click `nutriplan.html` to open it in your browser (local access only)

---

## 🌐 Accessing from Other Devices

### Same Network (Recommended for Testing)

1. Start the server on your computer (follow Option 1 or 2 above)
2. Find your computer's IP address in the server output (e.g., `192.168.x.x`)
3. On another device connected to the same WiFi/network:
   - Open a web browser
   - Go to: `http://192.168.x.x:3000`

### From the Internet (Using Ngrok or Similar)

For access from outside your network:

1. Install ngrok: https://ngrok.com/download
2. Start the NutriPlan server first (Node or Python)
3. In another terminal, run:
   ```bash
   ngrok http 3000
   ```
4. Copy the public URL from ngrok output and share it

---

## ⚙️ Setup Instructions

### For Gemini AI Features

1. The website comes with a pre-configured API key
2. All AI features work out of the box!
3. Optional: Add your own Gemini API key:
   - Get one free from: https://makersuite.google.com/app/apikey
   - Go to the AI Advisor section and paste your key

---

## 📱 Device Compatibility

✅ Desktop Browsers (Chrome, Firefox, Safari, Edge)
✅ Tablets (iPad, Android tablets)
✅ Mobile Phones (iOS, Android)
✅ Any device with a modern web browser

---

## 🛠️ Troubleshooting

### ⏳ "URL is taking too long to open" or "Not loading"

**Quick Fix:**

1. Run `diagnose.bat` first to check everything
2. Make sure you're opening the URL **immediately** after server starts
3. Try this sequence:
   - Start server: `node server.js`
   - Wait for "Waiting for requests..." message
   - **Immediately** open: http://localhost:3000 in your browser
   - Give it 5-10 seconds to load

**If still slow:**

- Check your internet - Gemini AI needs internet connection
- Try in a different browser (Chrome, Firefox, Edge)
- Clear browser cache (Ctrl+Shift+Delete)
- Disable browser extensions (they can slow things down)

### Server won't start / "Port already in use"

```
❌ Port 3000 is already in use!
```

**Solution:**

- Close other applications using port 3000
- Or change the PORT in server.js (line 6):
  ```javascript
  const PORT = 3001; // Change 3000 to 3001, 3002, etc.
  ```

### "File Not Found" or "Cannot find module"

- Make sure you're in `c:\codes` directory
- Check that `nutriplan.html` exists in the same folder as `server.js`
- Use `diagnose.bat` to verify the setup

### Can't access from other device

**Check:**

1. Both devices on the **same WiFi network**
2. Firewall - allow Node.js or Python through Windows Firewall
3. Router - no blocking between devices
4. Try the Network URL from server output, not localhost

**Test connection:**

```bash
ping 192.168.x.x
```

### AI features not working

- ✅ Check **internet connection** (Gemini AI is cloud-based)
- ✅ Check browser console (F12 → Console tab) for error messages
- ✅ Verify API key in AI Advisor section
- ✅ Try a different browser

### Browser shows "Cannot reach" or "Connection refused"

1. **Is the server running?** Check terminal for "Waiting for requests..."
2. **Try localhost:** http://localhost:3000
3. **Try with IP:** http://192.168.x.x:3000
4. **Wrong port?** Check server output for correct port number

---

## 📊 Performance Tips

- Use Chrome or Edge for best performance
- Close unnecessary browser tabs
- Disable browser extensions temporarily
- Use Ctrl+F5 (hard refresh) to clear cache while loading

---

## 📝 Files Included

- `nutriplan.html` - Main website (all-in-one file)
- `server.js` - Node.js server
- `server.py` - Python server
- `README.md` - This file

---

## 🎯 Quick Start Command Line

**Windows:**

```bash
cd c:\codes
node server.js
```

**Mac/Linux:**

```bash
cd ~/codes
node server.js
```

Or with Python:

```bash
python3 server.py
```

---

## ✨ Features Highlight

### 🤖 AI-Powered

- Gemini AI integration for personalized advice
- Real-time chat with AI nutritionist
- Automatic 7-day meal plan generation

### 💪 Comprehensive Tools

- BMI Calculator with detailed health assessment
- Multi-diet type support (Vegan, Keto, etc.)
- Recipe database with nutritional info
- Allergy management

### 🎨 Modern Design

- Responsive layout (works on all devices)
- Beautiful gradient UI
- Smooth animations
- Easy-to-use interface

---

## 🔐 Privacy & Security

- All data stays on your device
- API key is securely stored in browser local storage
- No data is sent to external servers except Gemini AI
- Safe for personal use

---

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Look at browser console (F12 → Console tab)
3. Verify your internet connection
4. Try restarting the server

---

## 🎓 Learning

This project demonstrates:

- Single-page application (SPA) design
- REST API integration
- Gemini AI API usage
- Responsive web design
- Local storage management
- JavaScript async/await patterns

---

Enjoy your healthy lifestyle with NutriPlan! 🥗✨
