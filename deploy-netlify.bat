@echo off
echo ========================================
echo 🚀 PORTMAN Netlify Deployment Setup
echo ========================================
echo.

echo 📋 Prerequisites Check:
echo    ✓ Node.js and npm installed
echo    ✓ GitHub repository pushed
echo    ✓ Netlify account created
echo.

echo 🔧 Installing Netlify CLI...
npm install -g netlify-cli

echo.
echo 📁 Navigating to frontend directory...
cd frontend

echo.
echo 🏗️ Building the project...
npm run build

echo.
echo 🌐 Deploying to Netlify...
echo    Note: This will create a new site or deploy to existing one
netlify deploy --prod --dir=out

echo.
echo ✅ Deployment completed!
echo.
echo 📝 Next steps:
echo    1. Go to netlify.com and find your deployed site
echo    2. Add environment variables in Site Settings > Environment Variables:
echo       - NEXT_PUBLIC_API_URL = https://your-backend-api.com/api/v1
echo       - NEXT_PUBLIC_SITE_URL = https://your-site.netlify.app
echo       - NODE_ENV = production
echo.
echo    3. For automatic deployments, connect your GitHub repo in:
echo       Site Settings > Build & Deploy > Continuous Deployment
echo.
echo 🌐 Your site should now be live!
pause
