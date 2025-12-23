# Inter Medi-A E-Commerce API Documentation

## Overview
Complete REST API for Inter Medi-A e-commerce platform supporting customers, sellers, and administrators.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## API Endpoints

### Authentication (`/api/auth`)

#### POST `/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "081234567890",
  "role": "customer" // or "seller"
}
```

#### POST `/auth/verify-otp`
Verify email with OTP
```json
{
  "userId": "user_id",
  "otp": "123456"
}
```

#### POST `/auth/login`
User login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST `/auth/resend-otp`
Resend OTP code
```json
{
  "userId": "user_id"
}
```

#### GET `/auth/profile`
Get current user profile (Protected)

### Products (`/api/products`)

#### GET `/products`
Get all products with filtering
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `category`: Category ID
- `search`: Search term
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: asc/desc (default: desc)

#### GET `/products/:id`
Get single product by ID or slug

#### GET `/products/featured`
Get featured products

#### POST `/products` (Seller only)
Create new product
```json
{
  "name": "Product Name",
  "description": "Product description",
  "shortDescription": "Short description",
  "category": "category_id",
  "price": 100000,
  "comparePrice": 120000,
  "stock": 50,
  "weight": 1.5,
  "tags": ["tag1", "tag2"]
}
```

#### PUT `/products/:id` (Seller only)
Update product

#### DELETE `/products/:id` (Seller only)
Delete product (soft delete)

### Categories (`/api/categories`)

#### GET `/categories`
Get all categories

#### GET `/categories/:id`
Get category by ID or slug

#### POST `/categories` (Admin only)
Create category

#### PUT `/categories/:id` (Admin only)
Update category

#### DELETE `/categories/:id` (Admin only)
Delete category

### Cart (`/api/cart`)

#### GET `/cart` (Protected)
Get user's cart

#### POST `/cart/add` (Protected)
Add item to cart
```json
{
  "productId": "product_id",
  "quantity": 2,
  "variant": "Red, Large"
}
```

#### PUT `/cart/item/:itemId` (Protected)
Update cart item quantity
```json
{
  "quantity": 3
}
```

#### DELETE `/cart/item/:itemId` (Protected)
Remove item from cart

#### DELETE `/cart/clear` (Protected)
Clear entire cart

### Orders (`/api/orders`)

#### POST `/orders` (Protected)
Create new order
```json
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "variant": "Red"
    }
  ],
  "shippingAddress": {
    "recipientName": "John Doe",
    "phone": "081234567890",
    "address": "Jl. Example No. 123",
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "postalCode": "12345"
  },
  "paymentMethod": "bank_transfer",
  "notes": "Please handle with care"
}
```

#### GET `/orders` (Protected)
Get user's orders

#### GET `/orders/:id` (Protected)
Get order details

#### PUT `/orders/:id/cancel` (Protected)
Cancel order
```json
{
  "reason": "Changed my mind"
}
```

### Wishlist (`/api/wishlist`)

#### GET `/wishlist` (Protected)
Get user's wishlist

#### POST `/wishlist/add` (Protected)
Add product to wishlist
```json
{
  "productId": "product_id"
}
```

#### DELETE `/wishlist/remove/:productId` (Protected)
Remove product from wishlist

### Reviews (`/api/reviews`)

#### GET `/reviews/product/:productId`
Get product reviews

#### POST `/reviews` (Protected)
Create product review
```json
{
  "productId": "product_id",
  "orderId": "order_id",
  "rating": 5,
  "comment": "Great product!"
}
```

#### PUT `/reviews/:id` (Protected)
Update review

#### DELETE `/reviews/:id` (Protected)
Delete review

### Chat (`/api/chat`)

#### GET `/chat` (Protected)
Get user's chats

#### POST `/chat/start` (Protected)
Start new chat
```json
{
  "sellerId": "seller_id",
  "productId": "product_id"
}
```

#### GET `/chat/:chatId/messages` (Protected)
Get chat messages

#### POST `/chat/:chatId/messages` (Protected)
Send message
```json
{
  "message": "Hello, is this product available?",
  "messageType": "text"
}
```

### Users (`/api/users`)

#### GET `/users/profile` (Protected)
Get user profile

#### PUT `/users/profile` (Protected)
Update user profile

#### POST `/users/addresses` (Protected)
Add new address

#### PUT `/users/addresses/:addressId` (Protected)
Update address

#### DELETE `/users/addresses/:addressId` (Protected)
Delete address

### Admin (`/api/admin`)

#### GET `/admin/dashboard` (Admin only)
Get admin dashboard data

#### GET `/admin/users` (Admin only)
Get all users with filtering

#### PUT `/admin/users/:id/status` (Admin only)
Update user status
```json
{
  "isActive": true
}
```

#### PUT `/admin/sellers/:id/verify` (Admin only)
Verify seller
```json
{
  "isVerified": true
}
```

#### GET `/admin/products` (Admin only)
Get all products

#### PUT `/admin/products/:id/status` (Admin only)
Update product status
```json
{
  "isActive": true,
  "isFeatured": false
}
```

#### GET `/admin/orders` (Admin only)
Get all orders

### Seller (`/api/seller`)

#### GET `/seller/dashboard` (Seller only)
Get seller dashboard data

#### GET `/seller/orders` (Seller only)
Get seller's orders

#### PUT `/seller/orders/:orderId/items/:itemIndex/status` (Seller only)
Update order item status
```json
{
  "status": "shipped",
  "trackingNumber": "JNE123456789",
  "shippingService": "JNE Regular"
}
```

#### GET `/seller/profile` (Seller only)
Get seller profile

#### PUT `/seller/profile` (Seller only)
Update seller profile

#### GET `/seller/analytics` (Seller only)
Get sales analytics

### File Upload (`/api/upload`)

#### POST `/upload/single` (Protected)
Upload single file
- Form data with 'file' field

#### POST `/upload/multiple` (Protected)
Upload multiple files
- Form data with 'files' field (max 5 files)

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // For validation errors
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting
- 100 requests per 15 minutes per IP
- 1000 requests per hour for authenticated users

## File Upload Limits
- Maximum file size: 5MB
- Supported formats: JPEG, JPG, PNG, GIF, WEBP
- Maximum 5 files per upload

## Demo Accounts
For testing purposes:

**Customer:**
- Email: customer@demo.com
- Password: password123

**Seller:**
- Email: seller@demo.com
- Password: password123

**Admin:**
- Email: admin@demo.com
- Password: password123

## WebSocket Events (Chat)
Connect to: `ws://localhost:5000`

### Events
- `join_chat` - Join chat room
- `send_message` - Send message
- `receive_message` - Receive message
- `disconnect` - Leave chat

## Error Codes
- `INVALID_CREDENTIALS` - Invalid login credentials
- `USER_NOT_FOUND` - User not found
- `PRODUCT_NOT_FOUND` - Product not found
- `INSUFFICIENT_STOCK` - Not enough stock
- `UNAUTHORIZED_ACCESS` - Access denied
- `VALIDATION_ERROR` - Input validation failed
