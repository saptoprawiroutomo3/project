#!/bin/bash

echo "🚀 Status Aplikasi E-Commerce"
echo "================================"

# Cek Backend
echo "🔧 Backend Status:"
if pgrep -f "server.js" > /dev/null; then
    echo "✅ Backend berjalan di port 3002"
    if curl -s http://localhost:3002/api/auth/login > /dev/null; then
        echo "✅ API endpoint dapat diakses"
    else
        echo "❌ API endpoint tidak dapat diakses"
    fi
else
    echo "❌ Backend tidak berjalan"
fi

echo ""

# Cek Frontend
echo "🎨 Frontend Status:"
if pgrep -f "vite" > /dev/null; then
    echo "✅ Frontend berjalan"
    echo "🌐 URL: http://localhost:5173"
else
    echo "❌ Frontend tidak berjalan"
fi

echo ""

# Cek Environment
echo "⚙️  Environment:"
if [ -f "/workspaces/project/inter-media-ecommerce/frontend/.env" ]; then
    echo "✅ File .env ditemukan"
    echo "📋 API URL: $(grep VITE_API_URL /workspaces/project/inter-media-ecommerce/frontend/.env)"
echo "🔗 Proxy: Frontend proxy ke backend port 3002"
else
    echo "❌ File .env tidak ditemukan"
fi

echo ""

# Test Login
echo "🔐 Test Login:"
cd /workspaces/project/inter-media-ecommerce
if node test-login.js > /dev/null 2>&1; then
    echo "✅ Login API berfungsi"
else
    echo "❌ Login API bermasalah"
fi

echo ""
echo "🎯 Akun Demo:"
echo "   Customer: customer@demo.com / password123"
echo "   Seller: seller@demo.com / password123"
echo "   Admin: admin@demo.com / password123"
