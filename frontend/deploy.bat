@echo off
REM PORTMAN Vercel Deployment Script for Windows
REM This script helps you deploy your project to Vercel

echo 🚀 PORTMAN Vercel Deployment Script
echo ====================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the frontend directory
    echo    cd frontend && deploy.bat
    exit /b 1
)

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

echo.
echo Choose deployment type:
echo 1) Preview deployment
echo 2) Production deployment  
echo 3) Link project (first time setup)
set /p choice=Enter your choice (1-3): 

if "%choice%"=="1" (
    echo 🔄 Deploying to preview...
    vercel
) else if "%choice%"=="2" (
    echo 🔄 Deploying to production...
    vercel --prod
) else if "%choice%"=="3" (
    echo 🔗 Linking project to Vercel...
    vercel link
) else (
    echo ❌ Invalid choice. Please run the script again.
    exit /b 1
)

echo.
echo ✅ Deployment completed!
echo 🌐 Check your Vercel dashboard for the deployment URL
pause
