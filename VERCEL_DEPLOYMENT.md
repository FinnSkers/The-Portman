# PORTMAN Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: One-Click Deploy (Fastest)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/FinnSkers/The-Portman&project-name=portman-frontend&root-directory=frontend)

### Option 2: Manual Setup

#### 1. Sign up for Vercel
- Go to [vercel.com/signup](https://vercel.com/signup)
- Sign up with your GitHub account

#### 2. Import Project
- Click "New Project" in Vercel dashboard
- Import `FinnSkers/The-Portman` repository
- Set **Root Directory** to `frontend`
- Set **Framework Preset** to `Next.js`

#### 3. Configure Environment Variables
In Vercel project settings, add these environment variables:
```
NEXT_PUBLIC_SITE_URL=https://your-project-name.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_TELEMETRY_DISABLED=1
```

#### 4. Deploy Settings
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

#### 5. Deploy
- Click "Deploy"
- Vercel will automatically build and deploy your frontend
- You'll get a live URL like: `https://portman-frontend.vercel.app`

## 🔧 Vercel Configuration

### Automatic Features Enabled:
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Automatic Git Deployments**
- ✅ **Preview Deployments** (for PRs)
- ✅ **Edge Functions**
- ✅ **Image Optimization**
- ✅ **Analytics**

### Performance Benefits:
- 🚀 **Edge Network:** Deploy to 100+ locations worldwide
- ⚡ **Fast Builds:** ~30 seconds build time
- 📊 **Real-time Analytics:** Built-in performance monitoring
- 🔄 **Automatic Updates:** Every Git push triggers new deployment

## 🌐 Post-Deployment

### 1. Custom Domain (Optional)
- Add your custom domain in Vercel dashboard
- Update DNS records to point to Vercel

### 2. Backend Integration
- Deploy your FastAPI backend to Heroku/Railway
- Update `NEXT_PUBLIC_API_URL` in Vercel environment variables

### 3. Monitoring
- Enable Vercel Analytics for performance insights
- Set up error tracking with Sentry (optional)

## 🛠️ Development Workflow

### Automatic Deployments:
- **Production:** `main` branch → `your-app.vercel.app`
- **Preview:** Feature branches → unique preview URLs
- **Local:** `npm run dev` → `localhost:3000`

### Quick Commands:
```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from local (if needed)
vercel --prod

# Check deployment status
vercel ls
```

Your PORTMAN frontend is now ready for professional deployment! 🎉
