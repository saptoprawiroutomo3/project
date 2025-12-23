#!/bin/bash

echo "🔧 Quick Development Setup for Inter Medi-A"

# Kill any existing processes on ports 5000 and 5173
echo "🛑 Stopping existing processes..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Wait a moment for processes to stop
sleep 2

# Start backend
echo "🚀 Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend
echo "🚀 Starting frontend server..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "👤 Demo accounts:"
echo "  Customer: customer@demo.com / password123"
echo "  Seller:   seller@demo.com / password123"
echo "  Admin:    admin@demo.com / password123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
