# Suvini Clothing - API Documentation

## Base URL

```
http://localhost:5000/api
```

## Endpoints

### 1. Products (Clothes)

#### Get All Products

**Endpoint:** `GET /clothes`

**Request:**

```bash
curl http://localhost:5000/api/clothes
```

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Summer Dress",
    "description": "Beautiful summer dress",
    "price": 599,
    "size": "M",
    "color": "Blue",
    "category": "Women",
    "image": "/uploads/filename.jpg",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Single Product

**Endpoint:** `GET /clothes/:id`

```bash
curl http://localhost:5000/api/clothes/uuid-here
```

#### Add New Product

**Endpoint:** `POST /clothes`

**Request:** (multipart/form-data)

```bash
curl -X POST http://localhost:5000/api/clothes \
  -F "name=Summer Dress" \
  -F "description=Beautiful dress" \
  -F "price=599" \
  -F "category=Women" \
  -F "size=M" \
  -F "color=Blue" \
  -F "image=@path/to/image.jpg"
```

**Form Fields:**

- `name` (required) - Product name
- `price` (required) - Product price
- `image` (required) - Product image file
- `description` - Product description
- `size` - Product size
- `color` - Product color
- `category` - Product category

**Response:**

```json
{
  "message": "Cloth added successfully",
  "cloth": { ... }
}
```

#### Update Product

**Endpoint:** `PUT /clothes/:id`

**Request:** (multipart/form-data)

```bash
curl -X PUT http://localhost:5000/api/clothes/uuid-here \
  -F "name=Updated Name" \
  -F "price=799" \
  -F "image=@path/to/image.jpg"
```

#### Delete Product

**Endpoint:** `DELETE /clothes/:id`

```bash
curl -X DELETE http://localhost:5000/api/clothes/uuid-here
```

**Response:**

```json
{
  "message": "Cloth deleted successfully",
  "cloth": { ... }
}
```

---

### 2. Wishlist

#### Get All Wishlist Items

**Endpoint:** `GET /wishlist`

```bash
curl http://localhost:5000/api/wishlist
```

**Response:**

```json
[
  {
    "id": "uuid",
    "clothId": "uuid",
    "addedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Wishlist with Product Details

**Endpoint:** `GET /wishlist/details/all`

```bash
curl http://localhost:5000/api/wishlist/details/all
```

**Response:**

```json
[
  {
    "id": "uuid",
    "clothId": "uuid",
    "addedAt": "2024-01-15T10:30:00Z",
    "clothDetails": {
      "id": "uuid",
      "name": "Summer Dress",
      "price": 599,
      ...
    }
  }
]
```

#### Add to Wishlist

**Endpoint:** `POST /wishlist`

**Request:**

```bash
curl -X POST http://localhost:5000/api/wishlist \
  -H "Content-Type: application/json" \
  -d '{"clothId": "uuid-here"}'
```

**Response:**

```json
{
  "message": "Added to wishlist",
  "wishlistItem": { ... }
}
```

#### Remove from Wishlist

**Endpoint:** `DELETE /wishlist/:id`

```bash
curl -X DELETE http://localhost:5000/api/wishlist/uuid-here
```

#### Remove Specific Item from Wishlist

**Endpoint:** `DELETE /wishlist/cloth/:clothId`

```bash
curl -X DELETE http://localhost:5000/api/wishlist/cloth/uuid-here
```

---

### 3. WhatsApp Integration

#### Get Contact Info

**Endpoint:** `GET /whatsapp/contact`

```bash
curl http://localhost:5000/api/whatsapp/contact
```

**Response:**

```json
{
  "number": "7349757596",
  "link": "https://wa.me/7349757596",
  "message": "Contact us on WhatsApp for orders and inquiries"
}
```

#### Generate Order Message

**Endpoint:** `POST /whatsapp/send-order`

**Request:**

```bash
curl -X POST http://localhost:5000/api/whatsapp/send-order \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "phone": "9876543210",
    "items": [
      {
        "name": "Summer Dress",
        "price": 599,
        "size": "M",
        "color": "Blue"
      }
    ],
    "totalAmount": 599
  }'
```

**Response:**

```json
{
  "success": true,
  "link": "https://wa.me/7349757596?text=...",
  "message": "WhatsApp order link generated",
  "details": {
    "number": "7349757596",
    "items": 1,
    "totalAmount": 599
  }
}
```

#### Generate Inquiry Message

**Endpoint:** `POST /whatsapp/send-inquiry`

**Request:**

```bash
curl -X POST http://localhost:5000/api/whatsapp/send-inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "message": "Do you have size XL available?"
  }'
```

**Response:**

```json
{
  "success": true,
  "link": "https://wa.me/7349757596?text=...",
  "message": "WhatsApp inquiry link generated"
}
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "message": "Error description",
  "error": "Error details"
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

---

## Testing the API

### Using cURL

```bash
# Test health check
curl http://localhost:5000/api/health

# Get all products
curl http://localhost:5000/api/clothes

# Add product
curl -X POST http://localhost:5000/api/clothes \
  -F "name=Test" \
  -F "price=100" \
  -F "category=General" \
  -F "image=@test.jpg"
```

### Using Postman

1. Import these endpoints into Postman
2. Set Base URL to `http://localhost:5000/api`
3. Test each endpoint

### Using JavaScript/Fetch

```javascript
// Get products
fetch("http://localhost:5000/api/clothes")
  .then((res) => res.json())
  .then((data) => console.log(data));

// Add to wishlist
fetch("http://localhost:5000/api/wishlist", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ clothId: "uuid" }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## Rate Limiting

Currently not implemented. For production, add rate limiting middleware.

## CORS

CORS is enabled for all origins. For production, restrict to specific domains.

## Authentication

No authentication currently. For production, implement JWT or similar.

---

For more information, see [README.md](README.md)
