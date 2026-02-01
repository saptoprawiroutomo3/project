#!/bin/bash

echo "🔧 Fixing Google Search Console validation errors..."

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📋 Changes made:"
echo "1. Fixed structured data URLs in BusinessSEO.tsx"
echo "2. Updated sitemap.xml with valid URLs only"
echo "3. Removed invalid /services route"
echo ""
echo "🔍 Next steps:"
echo "1. Wait 5-10 minutes for deployment"
echo "2. Go to Google Search Console"
echo "3. Re-run validation for affected pages"
echo "4. Check sitemap status"
