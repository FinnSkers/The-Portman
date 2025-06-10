#!/bin/bash

# PORTMAN Vercel Deployment Script
# This script helps you deploy your project to Vercel

echo "🚀 PORTMAN Vercel Deployment Script"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    echo "   cd frontend && ./deploy.sh"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Ask user what type of deployment
echo ""
echo "Choose deployment type:"
echo "1) Preview deployment"
echo "2) Production deployment"
echo "3) Link project (first time setup)"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🔄 Deploying to preview..."
        vercel
        ;;
    2)
        echo "🔄 Deploying to production..."
        vercel --prod
        ;;
    3)
        echo "🔗 Linking project to Vercel..."
        vercel link
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment completed!"
echo "🌐 Check your Vercel dashboard for the deployment URL"
