# Suvini Clothing - Quick Start Guide

## ⚡ 30-Second Setup

### Windows

1. Open command prompt in the Suvini folder
2. Run: `start-windows.bat`
3. Done! Everything opens automatically

### Mac/Linux

1. Open terminal in the Suvini folder
2. Run: `bash start.sh`
3. Done! Everything opens automatically

---

## 🚀 Manual Setup (5 minutes)

### Step 1: Install Backend

```bash
cd backend
npm install
```

### Step 2: Start Backend

```bash
npm start
```

You should see: ✅ Backend Server running on http://localhost:5000

### Step 3: Open Client

Open `client/index.html` in your web browser

### Step 4: Open Admin

Open `admin/index.html` in your web browser

---

## 📋 What You Get

### Client Website (client/index.html)

- ✅ Browse all products
- ✅ Search and filter by category
- ✅ Add items to wishlist
- ✅ Create orders via WhatsApp
- ✅ Fully responsive design
- ✅ No login required

### Admin Panel (admin/index.html)

- ✅ Dashboard with statistics
- ✅ Add new products with images
- ✅ Edit existing products
- ✅ Delete products
- ✅ Manage inventory
- ✅ Export data

### Backend API (localhost:5000)

- ✅ RESTful API endpoints
- ✅ File upload handling
- ✅ WhatsApp integration
- ✅ JSON data storage
- ✅ CORS enabled

---

## 🎯 First 5 Minutes

1. **Start Backend** (1 min)

   ```bash
   cd backend && npm install && npm start
   ```

2. **Open Admin** (1 min)
   - Open `admin/index.html`
   - Check if Backend Status shows "✓ Online"

3. **Add Your First Product** (2 min)
   - Click "➕ Add New Cloth"
   - Fill in details
   - Upload an image
   - Click "Add Product"

4. **View in Client** (1 min)
   - Open `client/index.html`
   - See your product in the shop!

---

## 📱 Test WhatsApp Ordering

1. Browse to a product in the client
2. Click "Buy Now" or add to wishlist & order
3. Enter your name and phone
4. Click the WhatsApp link
5. Confirm order on WhatsApp!

---

## 📁 Project Structure

```
Suvini/
├── backend/                # Node.js Server
│   ├── routes/            # API routes
│   ├── data/              # JSON files
│   ├── uploads/           # Product images
│   └── package.json
├── client/                # Shopping Website
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── admin/                 # Admin Dashboard
│   ├── index.html
│   ├── admin-styles.css
│   └── admin-script.js
├── README.md              # Full Documentation
├── SETUP.md               # Detailed Setup
├── API.md                 # API Reference
└── index.html             # Welcome Page
```

---

## 🔧 Change WhatsApp Number

1. Edit: `backend/routes/whatsapp.js`
2. Find: `const WHATSAPP_NUMBER = '7349757596'`
3. Replace with your number
4. Restart backend: `npm start`

---

## 🐛 Troubleshooting

### Backend won't start?

```bash
# Check if port 5000 is free
# Use different port:
PORT=3000 npm start
```

### Images not showing?

- Check `backend/uploads/` folder exists
- Check image file permissions
- Verify upload folder path in code

### "Cannot find module"?

```bash
# Reinstall dependencies
cd backend
rm -rf node_modules
npm install
npm start
```

### WhatsApp link not working?

- Try on mobile device
- Ensure WhatsApp is installed
- Check internet connection

---

## 📚 Documentation

- **README.md** - Complete project documentation
- **SETUP.md** - Detailed setup instructions
- **API.md** - API endpoint documentation
- **This file** - Quick reference guide

---

## 🚀 Next Steps

- [ ] Add your products via admin
- [ ] Customize colors/branding
- [ ] Test ordering via WhatsApp
- [ ] Add more products
- [ ] Deploy to production
- [ ] Enable HTTPS/SSL
- [ ] Add payment integration
- [ ] Setup email notifications

---

## 💡 Pro Tips

1. **Bulk Add Products**
   - Add all products first
   - Then enable clients to browse

2. **Backup Data**
   - Download exports regularly
   - Keep copies of `clothes.json` and `wishlist.json`

3. **Mobile Testing**
   - Use your computer's IP to test on mobile
   - Same WiFi network required

4. **Browser Console**
   - Open DevTools (F12)
   - Check Console for errors
   - Network tab to debug API calls

---

## 📞 Support

**WhatsApp:** 7349757596

For issues or questions, contact via WhatsApp.

---

## 🎉 You're Ready!

Everything is set up and ready to go. Start adding products and serving your customers!

**Happy selling! 🛍️**
