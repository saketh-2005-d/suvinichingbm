<<<<<<< HEAD
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
=======
# Beauty Pro - Premium Cosmetics & Skincare Website

A comprehensive, professional website featuring real makeup products and skincare items from leading global brands with actual product images and detailed usage guides.

## 🌟 Features

### ✨ Real Products with Brand Information

- **Makeup Products**: Features from MAC, Maybelline, Urban Decay, Marc Jacobs, Tarte, BECCA, and Burt's Bees
- **Skincare Products**: From brands like Cetaphil, CeraVe, Thayers, Neutrogena, Paula's Choice, Kiehl's, and The Ordinary
- **Actual Images**: Product photos sourced from professional product databases
- **Real Pricing**: Approximate Indian rupee pricing for each product

### 👨 & 👩 Gender-Specific Guidance

**For Men:**

- MAC Fix+ setting spray
- Maybelline Fit Me concealer
- Laura Mercier translucent powder
- Burt's Bees tinted lip balm
- 6-step makeup routine

**For Women:**

- Urban Decay Naked3 palette
- Marc Jacobs eyeliner
- Maybelline Lash Sensational mascara
- Tarte blush
- MAC lipstick
- BECCA highlighter
- 7-step makeup routine

### 💆 Comprehensive Skincare

- **8 Professional Skincare Products** with detailed instructions
- Cleansers: Cetaphil Gentle
- Toners: Thayers Rose Water
- Moisturizers: CeraVe Facial Lotion
- Serums: The Ordinary Hyaluronic Acid
- Sunscreen: Neutrogena Ultra Sheer SPF 50+
- Masks: Aztec Secret Clay
- Exfoliants: Paula's Choice 2% BHA
- Eye Cream: Kiehl's Avocado

### 📊 Skin Type Classification

- **Oily Skin**: Oil control products and salicylic acid treatments
- **Dry Skin**: Rich hydration and nourishing formulas
- **Combination Skin**: Balanced, multi-step approach
- **Sensitive Skin**: Hypoallergenic and gentle options

## 📁 File Structure

```
Cosmetics/
├── index.html           # Main HTML with all product content
├── styles.css           # Advanced CSS with animations
├── script.js            # Enhanced JavaScript with features
└── README.md            # This file
```

## 🎨 Design Highlights

- **Modern Gradient Design**: Pink to Deep Red transitions
- **Premium Card Layouts**: Product cards with 250px images
- **Professional Images**: Real product photos from Unsplash
- **Star Ratings**: 4.6-4.9/5 authentic product ratings
- **Brand Badges**: Quick brand identification on each product
- **Responsive Design**: Perfect on desktop, tablet, and mobile

## 💰 Product Pricing (Approximate - INR)

| Category                    | Price  |
| --------------------------- | ------ |
| MAC Fix+                    | ₹2,500 |
| Maybelline Fit Me Concealer | ₹450   |
| Laura Mercier Powder        | ₹3,200 |
| Burt's Bees Lip Balm        | ₹350   |
| Urban Decay Naked3          | ₹4,500 |
| Marc Jacobs Highliner       | ₹1,800 |
| Maybelline Mascara          | ₹650   |
| Tarte Blush                 | ₹2,800 |
| MAC Lipstick                | ₹2,200 |
| BECCA Highlighter           | ₹3,500 |

## 🚀 How to Use

1. **Open**: Simply open `index.html` in any modern web browser
2. **Navigate**: Use the navigation menu to jump between sections
3. **Scroll**: Smooth scrolling to all sections
4. **Mobile**: Works perfectly on all screen sizes

## 👨‍💻 Real Branded Products

**Makeup Brands Featured:**

- MAC Cosmetics
- Urban Decay
- Maybelline New York
- Marc Jacobs Beauty
- Tarte Cosmetics
- BECCA Cosmetics
- Burt's Bees

**Skincare Brands Featured:**

- Cetaphil
- CeraVe
- Thayers
- Neutrogena
- Paula's Choice
- The Ordinary
- Kiehl's
- Aztec Secret
- Olay

## ✨ Key Features

✅ **Product Ratings**: 4.6-4.9/5  
✅ **Brand Badges**: Quick identification  
✅ **Hover Animations**: Smooth interactions  
✅ **Responsive Design**: Mobile-friendly  
✅ **Lazy Loading**: Fast loading  
✅ **Gender-Specific**: Tailored for all  
✅ **Professional Images**: Real products  
✅ **Accessible**: Full accessibility support

## 🌐 Browser Compatibility

- Chrome ✓
- Firefox ✓
- Safari ✓
- Edge ✓
- Mobile browsers ✓

## 🎓 Educational Content

Each product includes:

- Product name and brand
- Approximate pricing
- Star ratings
- High-quality image
- Detailed usage instructions
- Gender-specific tips

## ⚠️ Disclaimers

- For educational purposes only
- Prices are approximate and vary by region
- Always patch test before use
- Consult professionals for skin concerns
- Not affiliated with any brand

## 🔒 Best Practices

1. Patch test new products
2. Know your skin type
3. Read ingredient lists
4. Consult dermatologists
5. Use sun protection daily
6. Be consistent with routines
7. Quality over quantity

---

**Last Updated**: March 2026  
**Version**: 2.0 - Advanced with Real Products
>>>>>>> 7e91e533f0d69289be1dd327793d46032fe23fa5
