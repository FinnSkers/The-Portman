@echo off
REM Quick Vercel Setup Script for PORTMAN
echo 🚀 PORTMAN - Vercel Auto-Deployment Setup
echo ==========================================

echo 📋 This script will help you set up automatic deployment to Vercel
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Install Vercel CLI globally
echo.
echo 📦 Installing Vercel CLI globally...
npm install -g vercel

REM Check if we're in the right directory
if not exist "frontend\package.json" (
    echo ❌ Error: Please run this script from the project root directory
    echo    The directory should contain a 'frontend' folder
    pause
    exit /b 1
)

echo.
echo 🔗 Now we'll link your project to Vercel...
echo    Please make sure you have:
echo    1. A Vercel account (sign up at vercel.com)
echo    2. Your GitHub repository pushed to GitHub
echo.
pause

cd frontend
vercel link

echo.
echo ✅ Setup completed!
echo.
echo 📝 Next steps:
echo    1. Go to vercel.com and find your project
echo    2. Add these environment variables in Vercel dashboard:
echo       - NEXT_PUBLIC_SITE_URL = https://your-project.vercel.app
echo       - NEXT_PUBLIC_API_URL = https://your-backend-api.com/api/v1
echo       - NEXT_TELEMETRY_DISABLED = 1
echo.
echo    3. Get your Vercel tokens and add them to GitHub secrets:
echo       - Go to GitHub repo → Settings → Secrets and variables → Actions
echo       - Add: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
echo.
echo    4. Push your code to GitHub - it will auto-deploy!
echo.
echo 🌐 For detailed instructions, see VERCEL_SETUP_GUIDE.md
pause
