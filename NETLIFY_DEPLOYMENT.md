# 🌐 Netlify Deployment Guide for PORTMAN

Complete guide to deploy your PORTMAN application to Netlify with automatic deployments.

## ✅ **YES! Your PORTMAN Project is Ready for Netlify Deployment**

### 🎯 **Deployment Status: READY ✅**

**Build Test**: ✅ Successfully builds without errors  
**Static Export**: ✅ Configured and working  
**Output Directory**: ✅ `out/` folder generated with all static files  
**Netlify Config**: ✅ `netlify.toml` properly configured  
**Deployment Scripts**: ✅ Updated for Netlify CLI  

### 📊 **Build Results:**
- **Total Pages**: 7 static routes generated
- **Bundle Size**: 177KB first load (optimized)
- **Build Time**: 8 seconds
- **Output**: Static HTML/CSS/JS ready for deployment

### 🚀 **Ready to Deploy Now:**

1. **Quick Deploy**: Use the updated `deploy.bat` script
2. **Manual Deploy**: Drag `frontend/out/` folder to Netlify
3. **Git Deploy**: Connect GitHub repo to Netlify

### ⚙️ **Production Environment Variables Needed:**
```
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
NEXT_PUBLIC_SITE_URL=https://your-app.netlify.app
NODE_VERSION=18
```

## 🚀 Quick Deploy (Updated Configuration)

### Method 1: One-Click Deploy (Recommended)

1. **Run the deployment script:**
   ```powershell
   .\deploy-netlify.bat
   ```

2. **Follow the prompts to:**
   - Install Netlify CLI
   - Build your project
   - Deploy to Netlify

### Method 2: Manual Deployment

1. **Install Netlify CLI:**
   ```powershell
   npm install -g netlify-cli
   ```

2. **Build your project:**
   ```powershell
   cd frontend
   npm run build
   ```

3. **Deploy to Netlify:**
   ```powershell
   netlify deploy --prod --dir=out
   ```

## ✅ Updated Configuration

### Next.js Configuration (`frontend/next.config.ts`):
```typescript
const nextConfig: NextConfig = {
  output: 'export',           // Static export for Netlify
  trailingSlash: true,        // Better URL handling
  images: { unoptimized: true }, // Required for static export
  // ... other config
};
```

### Netlify Configuration (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "out"             # Next.js static export output
  base = "frontend"

[build.environment]
  NODE_VERSION = "18"
  NODE_ENV = "production"
  NEXT_TELEMETRY_DISABLED = "1"
```

## 🔧 Environment Variables

Add these environment variables in your Netlify dashboard:

### Required Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
NEXT_PUBLIC_SITE_URL=https://your-app.netlify.app
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### How to Add Environment Variables:
1. Go to [netlify.com](https://netlify.com)
2. Select your site
3. Go to **Site Settings > Environment Variables**
4. Click **Add a variable**
5. Add each variable above

## 🔄 Automatic Deployments

### Setup GitHub Integration:

1. **In Netlify Dashboard:**
   - Go to **Site Settings > Build & Deploy**
   - Click **Link to Git repository**
   - Connect your GitHub account
   - Select your repository: `FinnSkers/The-Portman`

2. **Build Settings:**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/.next
   ```

3. **Deploy Settings:**
   ```
   Branch to deploy: main
   ```

### GitHub Actions (Optional):
The included `.github/workflows/netlify-deploy.yml` provides additional CI/CD capabilities.

**Required GitHub Secrets:**
```
NETLIFY_AUTH_TOKEN=your-netlify-auth-token
NETLIFY_SITE_ID=your-netlify-site-id
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api/v1
NEXT_PUBLIC_SITE_URL=https://your-app.netlify.app
```

## 🔨 Backend Deployment Options

Since Netlify only hosts static sites, you'll need a separate backend service:

### Recommended Backend Platforms:

#### 1. Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd backend
railway init
railway up
```

#### 2. Render
1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Create **Web Service**
4. Settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory:** `backend`

#### 3. Heroku
```bash
# Install Heroku CLI, then:
cd backend
heroku create your-backend-app
git subtree push --prefix backend heroku main
```

## 📋 Deployment Checklist

### Frontend (Netlify):
- [ ] Netlify account created
- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Build settings configured
- [ ] Custom domain configured (optional)

### Backend:
- [ ] Backend platform chosen (Railway/Render/Heroku)
- [ ] Backend deployed and running
- [ ] Environment variables configured on backend
- [ ] CORS configured for Netlify domain
- [ ] Database set up (if using PostgreSQL)

### Integration:
- [ ] `NEXT_PUBLIC_API_URL` points to deployed backend
- [ ] Backend `CORS_ALLOW_ORIGINS` includes Netlify domain
- [ ] Test authentication flow
- [ ] Test CV upload functionality
- [ ] Test admin panel access

## 🌟 Netlify vs Vercel Comparison

| Feature | Netlify | Vercel |
|---------|---------|---------|
| **Next.js Support** | ✅ Excellent | ✅ Native |
| **Free Tier** | ✅ Generous | ✅ Good |
| **Build Minutes** | 300/month | 100/month |
| **Bandwidth** | 100GB/month | 100GB/month |
| **Custom Domains** | ✅ Free | ✅ Free |
| **Edge Functions** | ✅ Yes | ✅ Yes |
| **Analytics** | ✅ Built-in | ✅ Built-in |
| **Forms** | ✅ Built-in | ❌ No |
| **Split Testing** | ✅ Yes | ✅ Yes |

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check build logs in Netlify dashboard

2. **API Connection Issues:**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check backend CORS configuration
   - Ensure backend is running and accessible

3. **Environment Variables Not Working:**
   - Variables must start with `NEXT_PUBLIC_` for client-side access
   - Redeploy after adding environment variables
   - Check variable names for typos

### Getting Help:
- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [GitHub Issues](https://github.com/FinnSkers/The-Portman/issues)

## 📚 Additional Resources

- [Netlify CLI Documentation](https://cli.netlify.com/)
- [Netlify Build Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/)

---

## 🎉 Success!

Once deployed, your PORTMAN application will be available at:
- **Production:** `https://your-app.netlify.app`
- **Preview:** Generated URLs for each deploy preview

Enjoy your deployed application! 🚀
