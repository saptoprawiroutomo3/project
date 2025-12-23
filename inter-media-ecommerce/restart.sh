#!/bin/bash

echo "🔄 Restarting services untuk reset rate limit..."

# Stop semua service
echo "⏹️  Stopping backend..."
pkill -f "server.js"

echo "⏹️  Stopping frontend..."
pkill -f "vite"

sleep 2

# Start backend dengan development mode
echo "🚀 Starting backend (development mode)..."
cd /workspaces/project/inter-media-ecommerce/backend
NODE_ENV=development npm start > /dev/null 2>&1 &

sleep 3

# Start frontend
echo "🚀 Starting frontend..."
cd /workspaces/project/inter-media-ecommerce/frontend
npm run dev > /dev/null 2>&1 &

sleep 3

echo "✅ Services restarted!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3002"
echo ""
echo "Rate limits reset:"
echo "- Auth: 100 requests/15min (development mode)"
echo "- API: 100 requests/15min"
echo "- Upload: 50 requests/hour"
