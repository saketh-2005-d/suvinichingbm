# Setup & Getting Started Guide for Suvini Clothing

## Quick Start (5 Minutes)

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start Backend Server

```bash
npm start
```

✅ Server will run on http://localhost:5000

### 3. Open Client Website

```bash
# Option A: Open directly in browser
open client/index.html

# Option B: Use Python server
cd client
python -m http.server 8000
# Visit http://localhost:8000
```

### 4. Open Admin Panel

```bash
# Same as client
open admin/index.html

# Or access via Python server
# http://localhost:8000/admin
```

## ✅ Verify Setup

1. Visit `http://localhost:5000/api/health`
   - Should show: `{"message":"Server is running","status":"OK"}`

2. Visit client `http://localhost:8000/client/`
   - Should show Suvini Clothing homepage

3. Visit admin `http://localhost:8000/admin/`
   - Should show admin dashboard

## 🎯 First Steps

### Add Your First Product (Admin)

1. Open Admin Panel
2. Click "➕ Add New Cloth"
3. Fill in details:
   - **Name:** "Summer Dress"
   - **Price:** "599"
   - **Category:** "Women"
   - **Color:** "Blue"
   - **Size:** "M"
   - Upload an image
4. Click "Add Product"
5. See it appear in Client website immediately!

### View Products (Client)

1. Refresh Client website
2. Your product appears in the shop
3. Click on product to see details
4. Click "Buy Now" → enter details → redirected to WhatsApp

## 📦 What's Included

| Component       | Purpose                   | Port            |
| --------------- | ------------------------- | --------------- |
| Backend Server  | API & file handling       | 5000            |
| Client Website  | Shopping interface        | 8000 (optional) |
| Admin Dashboard | Product management        | 8000 (optional) |
| Uploads Folder  | Store product images      | -               |
| JSON Data       | Store products & wishlist | -               |

## 🚨 Common Issues

### "Port 5000 is already in use"

```bash
# Use different port
PORT=3000 npm start
```

### "Cannot find module"

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### "Images not uploading"

- Check file size (max 10MB)
- Check file format (image only)
- Ensure `/backend/uploads` folder exists

### "WhatsApp link not working"

- Try on mobile device
- Ensure WhatsApp is installed
- Check internet connection

## 🔧 Change WhatsApp Number

Edit `backend/routes/whatsapp.js`:

```javascript
// Change this line:
const WHATSAPP_NUMBER = "7349757596";

// To your number:
const WHATSAPP_NUMBER = "YOUR_NUMBER";

// Restart server: npm start
```

## 📱 Testing on Mobile

1. Get your computer's IP address:

   ```bash
   # Windows
   ipconfig

   # Mac/Linux
   ifconfig
   ```

2. On mobile (same WiFi):
   - Visit `http://YOUR_IP:5000/api/health`
   - Visit `http://YOUR_IP:8000/client/`

## 🎨 Customize

### Change Store Name

- Edit `client/index.html` → Search for "Suvini Clothing"
- Edit `admin/index.html` → Search for "Suvini Admin"

### Change Colors

- Edit `client/styles.css` → `:root` section
- Edit `admin/admin-styles.css` → `:root` section

### Change Features

- Modify routes in `backend/routes/`
- Update frontend in `client/script.js` and `admin/admin-script.js`

## 📚 File Guide

| File                         | Purpose                    |
| ---------------------------- | -------------------------- |
| `backend/server.js`          | Main server & routes setup |
| `backend/routes/clothes.js`  | Product CRUD API           |
| `backend/routes/wishlist.js` | Wishlist management API    |
| `backend/routes/whatsapp.js` | WhatsApp integration       |
| `client/index.html`          | Client website structure   |
| `client/styles.css`          | Client styling             |
| `client/script.js`           | Client functionality       |
| `admin/index.html`           | Admin dashboard structure  |
| `admin/admin-styles.css`     | Admin styling              |
| `admin/admin-script.js`      | Admin functionality        |

## 🚀 Deployment (Future)

When ready to deploy:

### Backend

```bash
# Deploy to Heroku, Railway, or similar
git push heroku main
```

### Frontend

```bash
# Deploy to Netify, Vercel, or similar
npm run build
# Push to hosting service
```

Then update API URLs in both client and admin sites.

## 📞 Need Help?

- Check README.md for detailed documentation
- Review comments in source code
- Test individual API endpoints:
  ```bash
  curl http://localhost:5000/api/clothes
  ```

## ✨ Next Steps

1. ✅ Backend running
2. ✅ Client accessible
3. ✅ Admin accessible
4. 🔄 Add products via admin
5. 🔄 Browse products on client
6. 🔄 Test WhatsApp ordering
7. 🚀 Customize branding
8. 📦 Deploy to production

---

**You're all set! 🎉 Start by adding your first product in the admin panel.**
