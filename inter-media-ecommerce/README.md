# Inter Medi-A E-Commerce Platform

🏪 **Complete full-stack e-commerce solution** for printer, computer parts, and office equipment sales with professional service management.

![Inter Medi-A](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## 🚀 Quick Start

### Option 1: One-Command Setup
```bash
./start.sh
```

### Option 2: Manual Setup
```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev
```

**Access the application:**
- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend**: http://localhost:5000
- 📚 **API Documentation**: See `API_DOCUMENTATION.md`

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Customer** | customer@demo.com | password123 |
| **Seller** | seller@demo.com | password123 |
| **Admin** | admin@demo.com | password123 |

## ✨ Features

### 🛒 Customer Experience
- **Authentication**: JWT + OTP email verification
- **Product Discovery**: Advanced search, filtering, categories
- **Shopping**: Cart, wishlist, multiple payment methods
- **Order Management**: Real-time tracking, order history
- **Social**: Product reviews, ratings, seller chat
- **Profile**: Address management, order history

### 🏪 Seller Dashboard
- **Store Management**: Profile, branding, verification
- **Product Management**: CRUD operations, inventory, variants
- **Order Processing**: Status updates, shipping management
- **Analytics**: Sales reports, top products, revenue tracking
- **Communication**: Customer chat, order notifications

### 👨‍💼 Admin Panel
- **User Management**: Customer/seller oversight, verification
- **Product Control**: Approval, featured products, categories
- **Order Monitoring**: System-wide order tracking
- **Analytics**: Platform statistics, revenue reports
- **Content Management**: Categories, banners, promotions

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT + OTP
- **File Upload**: Multer
- **Real-time**: Socket.IO
- **Validation**: Express Validator

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: React Icons

### Database Schema
- **Users**: Customer, Seller, Admin roles
- **Products**: Full catalog with variants, reviews
- **Orders**: Complete order lifecycle management
- **Categories**: Hierarchical product organization
- **Chat**: Real-time messaging system

## 📁 Project Structure

```
inter-media-ecommerce/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/         # Database, environment config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, upload
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Helper functions
│   │   └── app.js          # Express app setup
│   ├── uploads/            # File storage
│   └── server.js           # Server entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── context/        # State management
│   │   ├── services/       # API calls
│   │   ├── hooks/          # Custom React hooks
│   │   └── router/         # Route configuration
│   └── public/             # Static assets
└── API_DOCUMENTATION.md    # Complete API reference
```

## 🎨 Design System

### Brand Colors
- **Primary Red**: #C62828 - #D32F2F
- **Logo Blue**: #0D47A1
- **Neutral**: White & Light Gray accents

### Design Philosophy
- **Nike Store Inspired**: Clean, modern, premium aesthetic
- **Bold Typography**: Strong visual hierarchy
- **Generous Whitespace**: Breathing room for content
- **Mobile-First**: Responsive across all devices

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start both frontend & backend
npm run backend      # Start backend only (port 5000)
npm run frontend     # Start frontend only (port 5173)
npm run install-all  # Install all dependencies
```

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://saptoprawiroutomo_db_user:1234qwer@cluster0.z3wyzso.mongodb.net/?appName=Cluster0
JWT_SECRET=inter_media_jwt_secret_key_2024
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Database Connection
**MongoDB Atlas**: Pre-configured and ready to use
```
mongodb+srv://saptoprawiroutomo_db_user:1234qwer@cluster0.z3wyzso.mongodb.net/?appName=Cluster0
```

## 🔐 Security Features
- **JWT Authentication**: Secure token-based auth
- **OTP Verification**: Email verification system
- **Role-Based Access**: Customer/Seller/Admin permissions
- **Input Validation**: Comprehensive data validation
- **File Upload Security**: Type and size restrictions
- **CORS Protection**: Cross-origin request security

## 📱 Mobile Responsive
- **Tailwind CSS**: Mobile-first responsive design
- **Touch Optimized**: Mobile-friendly interactions
- **Progressive Web App**: PWA-ready architecture

## 🚀 Production Ready
- **Error Handling**: Comprehensive error management
- **Logging**: Request and error logging
- **Validation**: Input sanitization and validation
- **Security**: Production security best practices
- **Performance**: Optimized for speed and scalability

## 📚 API Documentation
Complete API documentation available in `API_DOCUMENTATION.md` including:
- All endpoints with examples
- Authentication requirements
- Request/response formats
- Error codes and handling
- WebSocket events for real-time features

## 🤝 Contributing
This is a complete, production-ready e-commerce platform built for the Inter Medi-A business case. The codebase follows industry best practices and is ready for deployment.

## 📄 License
MIT License - Built for educational and commercial use.

---

**🎯 Ready to launch your e-commerce business with Inter Medi-A!**
