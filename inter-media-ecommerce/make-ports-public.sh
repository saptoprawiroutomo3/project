#!/bin/bash

echo "🔧 Making ports public for Codespaces..."

# Get the codespace name
CODESPACE_NAME=$(echo $CODESPACE_NAME)

if [ -z "$CODESPACE_NAME" ]; then
    echo "❌ Not running in Codespaces"
    exit 1
fi

echo "📋 Codespace: $CODESPACE_NAME"
echo "🌐 Backend URL: https://$CODESPACE_NAME-5000.app.github.dev"
echo "🌐 Frontend URL: https://$CODESPACE_NAME-5173.app.github.dev"

echo ""
echo "⚠️  MANUAL STEPS REQUIRED:"
echo "1. Go to VS Code PORTS tab (bottom panel)"
echo "2. Right-click on port 5000 → Change Port Visibility → Public"
echo "3. Right-click on port 5173 → Change Port Visibility → Public"
echo ""
echo "Or use Command Palette (Ctrl+Shift+P):"
echo "- Type: 'Codespaces: Focus on Ports View'"
echo "- Make ports 5000 and 5173 public"
echo ""
echo "✅ After making ports public, refresh your frontend page"
