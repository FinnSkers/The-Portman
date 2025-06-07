# PORTMAN Production Deployment Guide

## Prerequisites

### Environment Setup
1. **Node.js**: Version 18 or higher
2. **PostgreSQL**: Version 14 or higher
3. **Redis**: For session storage (optional but recommended)

### Required Environment Variables
```bash
# Core Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret-key
NODE_ENV=production

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# API Configuration
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_WS_URL=wss://ws.your-domain.com

# Security
ADMIN_EMAILS=admin@your-domain.com,admin2@your-domain.com

# Monitoring (Optional)
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Configure Project**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add NEXTAUTH_SECRET
   vercel env add DATABASE_URL
   # Add all other environment variables
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t portman-frontend .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXTAUTH_URL=https://your-domain.com \
     -e DATABASE_URL=postgresql://... \
     portman-frontend
   ```

### Option 3: Traditional VPS/Server

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Use Process Manager**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start application
   pm2 start npm --name "portman" -- start
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

## Database Setup

### 1. PostgreSQL Configuration
```sql
-- Create database
CREATE DATABASE portman_production;

-- Create user
CREATE USER portman_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE portman_production TO portman_user;
```

### 2. Run Migrations
```bash
cd frontend
npx prisma migrate deploy
npx prisma generate
```

### 3. Seed Database (Optional)
```bash
npx prisma db seed
```

## Security Configuration

### 1. SSL/TLS Setup
- **Vercel**: Automatic SSL certificates
- **Traditional Server**: Use Let's Encrypt or CloudFlare

### 2. Security Headers
```nginx
# nginx.conf
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 3. Rate Limiting
```nginx
# nginx rate limiting
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        location /api/ {
            limit_req zone=api burst=20 nodelay;
        }
    }
}
```

## Performance Optimization

### 1. Enable Compression
```javascript
// next.config.js
module.exports = {
  compress: true,
  experimental: {
    optimizeServerReact: true,
  },
}
```

### 2. CDN Configuration
- **Vercel**: Built-in global CDN
- **CloudFlare**: Configure caching rules
- **AWS CloudFront**: Set up distribution

### 3. Database Optimization
```sql
-- Add indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_cv_uploads_user_id ON cv_uploads(user_id);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_slug ON portfolios(slug);
```

## Monitoring Setup

### 1. Health Checks
```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
```

### 2. Error Monitoring
```javascript
// sentry.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### 3. Analytics
```javascript
// Google Analytics 4
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: document.title,
  page_location: window.location.href,
});
```

## Backup Strategy

### 1. Database Backups
```bash
#!/bin/bash
# backup.sh
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
aws s3 cp backup_*.sql s3://your-backup-bucket/
```

### 2. File Storage Backups
```bash
# Backup uploaded files
rsync -av /app/uploads/ s3://your-files-bucket/
```

## CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Post-Deployment Checklist

- [ ] SSL certificates are active
- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] Health checks passing
- [ ] Error monitoring active
- [ ] Analytics tracking
- [ ] Backup systems running
- [ ] Performance monitoring
- [ ] Security headers configured
- [ ] Rate limiting enabled

## Maintenance

### 1. Regular Updates
```bash
# Update dependencies monthly
npm audit
npm update

# Update database schema
npx prisma migrate deploy
```

### 2. Performance Monitoring
- Monitor Core Web Vitals
- Track API response times
- Monitor database performance
- Check error rates

### 3. Security Audits
- Regular dependency audits
- SSL certificate renewals
- Security header validation
- Access log reviews
