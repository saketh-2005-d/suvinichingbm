# Suvini Clothing - Online Fashion Store

A complete fullstack e-commerce website for Suvini Clothing with client-side shopping and admin-side management.

## 🚀 Features

### Client Side

- 🛍️ Browse all products without login
- ❤️ Add products to wishlist
- 🛒 Order products with customer details
- 💬 WhatsApp integration for orders and inquiries
- 🔍 Search and filter products by category
- 📱 Fully responsive design

### Admin Side

- � **Secure login** (Username: `admin`, Password: `admin123`)
- 📊 Dashboard with statistics
- ➕ Add new products with images
- ✏️ Edit existing products
- 🗑️ Delete products
- 📋 Manage all products with search/filter
- 📤 Export data (products and wishlist)
- ⚙️ Settings and system information
- 🚪 One-click logout

### Backend API

- RESTful API with Express.js
- JSON file storage (can be upgraded to database)
- File upload handling with Multer
- CORS enabled for frontend communication
- WhatsApp API integration

## 📁 Project Structure

```
Suvini/
├── backend/                 # Node.js/Express server
│   ├── routes/
│   │   ├── clothes.js      # Product CRUD operations
│   │   ├── wishlist.js     # Wishlist management
│   │   └── whatsapp.js     # WhatsApp integration
│   ├── data/               # JSON storage
│   ├── uploads/            # Product images
│   ├── server.js           # Main server file
│   └── package.json        # Dependencies
├── client/                 # Client-side website
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── admin/                  # Admin dashboard
    ├── index.html
    ├── admin-styles.css
    └── admin-script.js
```

## 🛠️ Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A modern web browser

### Backend Setup

1. Navigate to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

The server will run on `http://localhost:5000`

For development with auto-reload:

```bash
npm run dev
```

### Client Setup

1. Open `client/index.html` in a web browser
   - Or use a local server:
   ```bash
   cd client
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

### Admin Setup

1. Open `admin/index.html` in a web browser
   - Or use the same local server on port 8000
   - Navigate to `http://localhost:8000/admin/`

## 📡 API Endpoints

### Products

- `GET /api/clothes` - Get all products
- `GET /api/clothes/:id` - Get product by ID
- `POST /api/clothes` - Create new product (multipart/form-data)
- `PUT /api/clothes/:id` - Update product (multipart/form-data)
- `DELETE /api/clothes/:id` - Delete product

### Wishlist

- `GET /api/wishlist` - Get all wishlist items
- `GET /api/wishlist/details/all` - Get wishlist with product details
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist
- `DELETE /api/wishlist/cloth/:clothId` - Remove specific cloth from wishlist

### WhatsApp

- `GET /api/whatsapp/contact` - Get WhatsApp contact info
- `POST /api/whatsapp/send-order` - Generate order message link
- `POST /api/whatsapp/send-inquiry` - Generate inquiry message link

## 🔧 Configuration

### WhatsApp Number

Current WhatsApp number: **7349757596**

To change the WhatsApp number:

1. Edit `backend/routes/whatsapp.js`
2. Change the `WHATSAPP_NUMBER` variable
3. Restart the backend server

### API Base URL

Default: `http://localhost:5000/api`

To change in client:

- Edit `client/script.js` → `const API_BASE = 'YOUR_URL'`

To change in admin:

- Edit `admin/admin-script.js` → `const API_BASE = 'YOUR_URL'`

## 📝 How to Use

### Adding Products (Admin)

1. Open admin panel (`admin/index.html`)
2. Click "Add New Cloth" tab
3. Fill in product details:
   - Product Name
   - Description (optional)
   - Price
   - Category (Men/Women/Kids/General)
   - Size (e.g., XS, S, M, L, XL)
   - Color
   - Upload Product Image
4. Click "Add Product"

### Browsing Products (Client)

1. Open client website (`client/index.html`)
2. Browse products on the home page
3. Use search and filters to find specific items
4. Click product to view details
5. Add to wishlist or buy immediately

### Placing Orders

1. View a product
2. Click "Buy Now" or proceed from wishlist
3. Enter your name and phone number
4. You'll be redirected to WhatsApp with prepopulated order details
5. Confirm order via WhatsApp

## 💾 Data Storage

Currently uses JSON files:

- `backend/data/clothes.json` - Product database
- `backend/data/wishlist.json` - Wishlist database

To add images:

- Images are stored in `backend/uploads/`
- Can be accessed via `/uploads/filename`

### Upgrading to Database

To use MongoDB or other databases:

1. Install appropriate npm package (e.g., `npm install mongoose`)
2. Replace file operations in routes with database queries
3. Update models accordingly

## 🌐 Deployment

### Deploying Backend

1. Use services like:
   - Heroku
   - Railway
   - Render
   - AWS/Azure/GCP

2. Push code to git repository
3. Configure environment variables if needed
4. Deploy using platform's instructions

### Deploying Client & Admin

1. Build and upload to:
   - Netlify
   - Vercel
   - GitHub Pages
   - Any static hosting service

2. Update `API_BASE` URLs to point to deployed backend

## 🔐 Security Notes

For production deployment:

1. Use environment variables for sensitive data
2. Implement authentication for admin panel
3. Use HTTPS/SSL
4. Add input validation and sanitization
5. Implement rate limiting
6. Use actual database instead of JSON files
7. Add user authentication for wishlist persistence
8. Validate file uploads (type, size)

## 📱 WhatsApp Integration

- Orders are sent as pre-formatted messages via WhatsApp
- Customer details and product info are included
- No email required - everything is WhatsApp-based
- Can handle multiple product orders in single message

## 🐛 Troubleshooting

### Backend not running?

- Check if port 5000 is available
- Run `npm install` in backend folder
- Check Node.js version compatibility

### Images not showing?

- Ensure `backend/uploads` folder exists
- Check file permissions
- Verify API_BASE URL is correct in frontend

### WhatsApp link not opening?

- Check WhatsApp number format (must include country code)
- Ensure message text is properly encoded
- Test link on mobile device

### CORS errors?

- Ensure backend is running
- Check CORS is enabled in server.js
- Verify API_BASE URL matches backend URL

## 📞 Support

**WhatsApp:** 7349757596

For inquiries, orders, or support, contact via WhatsApp.

## 📄 License

This project is created for Suvini Clothing.

## 🚀 Future Enhancements

- [ ] User authentication system
- [ ] Payment gateway integration
- [ ] Order tracking system
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Inventory management
- [ ] Multiple admin users
- [ ] Analytics dashboard
- [ ] SMS notifications
- [ ] Mobile app (React Native)

---

**Made with ❤️ for Suvini Clothing**
