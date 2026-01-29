#!/bin/bash

echo "🚀 Deploying Inter Media App with SEO Optimization..."

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "🔧 Don't forget to set environment variables in Vercel dashboard:"
echo "   MONGODB_URI=mongodb+srv://saptoprawiroutomo_db_user:1234qwer@cluster0.z3wyzso.mongodb.net/intermediadb?retryWrites=true&w=majority&appName=Cluster0"
echo "   NEXTAUTH_SECRET=inter-media-nextauth-secret-2024-strong-key"
echo "   NEXTAUTH_URL=https://your-app.vercel.app"
echo ""
echo "📊 After deployment:"
echo "   1. Update NEXTAUTH_URL with actual domain"
echo "   2. Submit sitemap to Google Search Console"
echo "   3. Setup Google Analytics"
echo ""
echo "🎉 Your app will dominate Google search results!"
