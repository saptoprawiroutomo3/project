#!/bin/bash

echo "🚀 Starting Inter Medi-A E-Commerce Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies if not already installed
if [ ! -d "node_modules" ] || [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install-all
fi

# Create uploads directory if it doesn't exist
if [ ! -d "backend/uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p backend/uploads/avatars
    mkdir -p backend/uploads/products
    mkdir -p backend/uploads/categories
    mkdir -p backend/uploads/misc
fi

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "⚙️ Creating backend .env file..."
    cp backend/.env.example backend/.env
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚙️ Creating frontend .env file..."
    echo "VITE_API_URL=http://localhost:5000/api" > frontend/.env
fi

# Seed database with sample data
echo "🌱 Seeding database with sample data..."
cd backend && npm run seed && cd ..

echo "🎉 Setup complete!"
echo ""
echo "📋 Available commands:"
echo "  npm run dev        - Start both backend and frontend"
echo "  npm run backend    - Start backend only"
echo "  npm run frontend   - Start frontend only"
echo ""
echo "🌐 URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:5000"
echo "  API Docs: See API_DOCUMENTATION.md"
echo ""
echo "👤 Demo accounts:"
echo "  Customer: customer@demo.com / password123"
echo "  Seller:   seller@demo.com / password123"
echo "  Admin:    admin@demo.com / password123"
echo ""
echo "🚀 Starting development servers..."

# Start the application
npm run dev
