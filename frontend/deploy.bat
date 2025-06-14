@echo off
REM PORTMAN Netlify Deployment Script for Windows
REM This script helps you deploy your project to Netlify

echo 🚀 PORTMAN Netlify Deployment Script
echo ====================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the frontend directory
    echo    cd frontend && deploy.bat
    exit /b 1
)

REM Check if Netlify CLI is installed
netlify --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Netlify CLI...
    npm install -g netlify-cli
)

echo.
echo Choose deployment type:
echo 1) Preview deployment
echo 2) Production deployment  
echo 3) Link project (first time setup)
echo 4) Build only
set /p choice=Enter your choice (1-4): 

if "%choice%"=="1" (
    echo 🔄 Building and deploying to preview...
    npm run build
    netlify deploy --dir=out
) else if "%choice%"=="2" (
    echo 🔄 Building and deploying to production...
    npm run build
    netlify deploy --prod --dir=out
) else if "%choice%"=="3" (
    echo 🔗 Linking project to Netlify...
    netlify link
) else if "%choice%"=="4" (
    echo 🔨 Building project...
    npm run build
    echo ✅ Build completed! Check the 'out' directory
) else (
    echo ❌ Invalid choice. Please run the script again.
    exit /b 1
)

echo.
echo ✅ Deployment completed!
echo 🌐 Check your Netlify dashboard for the deployment URL
pause
