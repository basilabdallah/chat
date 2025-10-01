# Deployment Guide

This guide covers deploying your Creative Chat application to production.

## Prerequisites

Before deploying:
- ✅ Application works locally
- ✅ Supabase project is set up and running
- ✅ Environment variables are configured
- ✅ All features tested

---

## Option 1: Vercel (Recommended)

Vercel is the easiest option for Next.js applications.

### Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name? **creative-chat** (or your choice)
   - Directory? **./** (press Enter)
   - Override settings? **N**

4. **Add Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
   
   Or add them in the Vercel dashboard:
   - Go to your project settings
   - Click **Environment Variables**
   - Add both variables for **Production**, **Preview**, and **Development**

5. **Redeploy**
   ```bash
   vercel --prod
   ```

Your app is now live! 🎉

### Deploy with GitHub (Automatic)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/creative-chat.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **"Add New Project"**
   - Import your GitHub repository
   - Add environment variables
   - Click **"Deploy"**

3. **Automatic Deployments**
   - Every push to `main` branch auto-deploys
   - Pull requests get preview deployments
   - Zero downtime deployments

---

## Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the app**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Add Environment Variables**
   - Go to Site settings > Build & deploy > Environment
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Create `netlify.toml`**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

---

## Option 3: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize**
   ```bash
   railway init
   ```

4. **Add Environment Variables**
   ```bash
   railway variables set NEXT_PUBLIC_SUPABASE_URL=your-url
   railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

5. **Deploy**
   ```bash
   railway up
   ```

---

## Option 4: Docker (Self-Hosted)

1. **Create `Dockerfile`**
   ```dockerfile
   FROM node:18-alpine AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production

   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static

   EXPOSE 3000
   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Update `next.config.js`**
   ```javascript
   module.exports = {
     output: 'standalone',
     // ... rest of config
   }
   ```

3. **Build Image**
   ```bash
   docker build -t creative-chat .
   ```

4. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_SUPABASE_URL=your-url \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
     creative-chat
   ```

---

## Post-Deployment Checklist

### Test Core Functionality

- [ ] Sign up creates new account
- [ ] Sign in works correctly
- [ ] Profile appears in sidebar
- [ ] Can see and join rooms
- [ ] Can send messages
- [ ] Messages appear in real-time
- [ ] Emoji reactions work
- [ ] Typing indicators show
- [ ] Can edit/delete own messages
- [ ] User status updates correctly

### Security Checks

- [ ] Environment variables are set correctly
- [ ] Using `anon` key, not `service_role`
- [ ] HTTPS is enabled (automatic on Vercel/Netlify)
- [ ] RLS policies are active in Supabase
- [ ] No sensitive data in client-side code

### Performance Optimization

- [ ] Images are optimized
- [ ] Code is minified (automatic in production build)
- [ ] Caching headers are set
- [ ] Database queries are indexed
- [ ] Realtime subscriptions are cleaned up properly

---

## Supabase Production Settings

### 1. Update CORS Settings

If deploying to a custom domain:

1. Go to Supabase Dashboard > Settings > API
2. Add your production URL to allowed origins
3. Format: `https://yourdomain.com`

### 2. Enable Email Confirmations

For production, enable email verification:

1. Go to Authentication > Settings
2. Enable **"Enable email confirmations"**
3. Configure email templates
4. Set up a custom SMTP server (optional)

### 3. Set Up Custom Domain (Optional)

1. Go to Project Settings > General
2. Add custom domain
3. Update DNS records
4. Wait for SSL certificate

### 4. Monitor Usage

Keep an eye on:
- Database size
- Realtime connections
- API requests
- Storage usage

Free tier limits:
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- Unlimited API requests

### 5. Set Up Backups

Supabase automatically backs up your database, but you can:
1. Go to Database > Backups
2. Enable point-in-time recovery (paid plans)
3. Or manually export data periodically

---

## Environment Variables Reference

Required for all deployments:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

Optional (for advanced features):

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## Custom Domain Setup

### Vercel

1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS:
   - **Type**: A
   - **Name**: @ or subdomain
   - **Value**: 76.76.21.21
4. Or use CNAME:
   - **Name**: subdomain
   - **Value**: cname.vercel-dns.com

### Netlify

1. Go to Site settings > Domain management
2. Add custom domain
3. Update DNS:
   - **Type**: CNAME
   - **Name**: @ or subdomain  
   - **Value**: your-site.netlify.app

---

## Monitoring & Analytics

### Built-in Options

**Vercel Analytics** (Automatic on Vercel)
- Real User Monitoring
- Web Vitals
- Deployment analytics

**Supabase Dashboard**
- Database queries
- API usage
- Realtime connections
- Error logs

### Third-Party Options

**Sentry** (Error Tracking)
```bash
npm install @sentry/nextjs
```

**Google Analytics**
```bash
npm install @next/third-parties
```

**Plausible/Umami** (Privacy-friendly)
- Add script to `app/layout.tsx`

---

## Scaling Considerations

### Database Optimization

- Add indexes for frequently queried columns
- Use connection pooling
- Archive old messages
- Implement pagination

### Caching

- Enable Next.js ISR for static pages
- Use Vercel Edge Caching
- Cache user profiles client-side

### CDN

- Images automatically CDN'd on Vercel/Netlify
- Use Next.js Image component for optimization

### Rate Limiting

Consider adding rate limits for:
- Message sending (prevent spam)
- Room creation
- API endpoints

---

## Rollback Procedure

### Vercel

1. Go to Deployments
2. Find previous working deployment
3. Click three dots > Promote to Production

### Railway/Render

1. Go to Deployments
2. Select previous version
3. Click Redeploy

### Docker

```bash
# Tag your versions
docker tag creative-chat creative-chat:v1.0.0

# Roll back
docker run creative-chat:v1.0.0
```

---

## Maintenance Mode

To enable maintenance mode:

1. Create `app/maintenance/page.tsx`:
   ```tsx
   export default function Maintenance() {
     return (
       <div className="h-screen flex items-center justify-center">
         <div className="text-center">
           <h1>Under Maintenance</h1>
           <p>We'll be back soon!</p>
         </div>
       </div>
     )
   }
   ```

2. Redirect all routes temporarily
3. Or use a custom middleware

---

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Railway Docs](https://docs.railway.app)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## Production Checklist

Before going live:

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Email confirmations enabled
- [ ] RLS policies verified
- [ ] Error monitoring set up
- [ ] Backup strategy in place
- [ ] Team members have access
- [ ] Documentation updated

---

**Congratulations! Your Creative Chat app is now live! 🚀**

Monitor your deployment and iterate based on user feedback.
