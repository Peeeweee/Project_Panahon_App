# Deploying Panahon Weather App to Vercel

This guide will help you deploy your Panahon Weather App to Vercel with serverless backend functions that are always available.

## Why Vercel?

- **Always-On API**: Your backend runs as serverless functions that automatically wake up when users access your app
- **Free Tier**: Perfect for personal projects with generous limits
- **Zero Configuration**: The app is pre-configured for Vercel deployment
- **Auto HTTPS**: Automatic SSL certificates
- **Global CDN**: Fast loading from anywhere in the world
- **No Server Maintenance**: No need to worry about server uptime or scaling

## Prerequisites

1. A [GitHub](https://github.com) account
2. A [Vercel](https://vercel.com) account (can sign up with GitHub)
3. Your project code pushed to a GitHub repository

## Step 1: Push Your Code to GitHub

If you haven't already pushed your code to GitHub:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Vercel deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it as a Vite project
5. **Configure Build Settings** (Vercel should auto-detect these, but verify):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Click **"Deploy"**

That's it! Your app will be live in 1-2 minutes.

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (Your account)
# - Link to existing project? No
# - What's your project's name? panahon-weather-app
# - In which directory is your code? ./
# - Want to override settings? No

# For production deployment
vercel --prod
```

## Step 3: Verify Deployment

After deployment, Vercel will give you a URL like:
```
https://panahon-weather-app.vercel.app
```

### Test Your API Endpoints:

1. **Health Check**:
   ```
   https://your-app.vercel.app/api/health
   ```

2. **Weather by Location**:
   ```
   https://your-app.vercel.app/api/weather/location/Philippines
   ```

3. **Weather by Coordinates**:
   ```
   https://your-app.vercel.app/api/weather/coordinates?lat=14.5995&lon=120.9842
   ```

4. **7-Day Forecast**:
   ```
   https://your-app.vercel.app/api/weather/forecast/coordinates?lat=14.5995&lon=120.9842
   ```

## How It Works

### Serverless Architecture

Your app is deployed with:

1. **Frontend**: Static files served from Vercel's global CDN
2. **Backend**: Serverless functions in the `/api` directory that:
   - Automatically start when a request comes in (cold start ~100-500ms)
   - Stay warm for frequently accessed endpoints
   - Scale automatically with traffic
   - Have no cost when not in use

### API Endpoints Structure

```
/api
├── health.js                          → GET /api/health
└── weather
    ├── coordinates.js                 → GET /api/weather/coordinates?lat=...&lon=...
    ├── location
    │   └── [location].js             → GET /api/weather/location/:location
    └── forecast
        └── coordinates.js            → GET /api/weather/forecast/coordinates?lat=...&lon=...
```

### Automatic API URL Detection

The app automatically uses the correct API endpoint:
- **Development**: `http://localhost:3001/api` (local Express server)
- **Production**: `/api` (Vercel serverless functions)

No configuration needed!

## Environment Variables (Optional)

If you want to customize the API URL:

1. In Vercel Dashboard, go to: **Project Settings** → **Environment Variables**
2. Add: `VITE_API_URL` = `https://your-custom-api.com/api`

## Local Development vs Production

### Local Development (npm start)
```bash
npm start
```
- Frontend: Vite dev server on http://localhost:3000
- Backend: Express server on http://localhost:3001
- Auto-kills port conflicts
- Hot module replacement (HMR)

### Production (Vercel)
```bash
npm run build    # Build for production
vercel --prod    # Deploy to production
```
- Frontend: Static files on Vercel CDN
- Backend: Serverless functions
- Automatic HTTPS
- Global distribution

## Updating Your Deployment

Every time you push to your GitHub repository:

```bash
git add .
git commit -m "Update feature"
git push
```

Vercel will **automatically redeploy** your app! 🎉

### Manual Redeploy

In Vercel Dashboard:
1. Go to your project
2. Click **"Deployments"**
3. Click **"⋮"** on any deployment
4. Click **"Redeploy"**

## Custom Domain (Optional)

1. In Vercel Dashboard: **Project Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel handles SSL automatically

## Monitoring & Logs

View your serverless function logs:
1. Vercel Dashboard → Your Project
2. Click **"Logs"** or **"Functions"** tab
3. See real-time logs of API calls

## Troubleshooting

### API Returns 404
- Make sure your `api/` folder is in the project root
- Verify the file structure matches the endpoints
- Check deployment logs in Vercel Dashboard

### Cold Starts
- First request after inactivity may take 100-500ms
- Subsequent requests are fast
- Consider adding a health check ping for critical apps

### Build Errors
- Check that all dependencies are in `package.json`
- Ensure `npm run build` works locally
- Review build logs in Vercel Dashboard

## Cost

**Vercel Hobby (Free) Plan includes:**
- 100 GB bandwidth per month
- Unlimited deployments
- 100 GB-hours serverless function execution
- Automatic HTTPS
- Perfect for personal projects

Your weather app will easily fit within these limits!

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Serverless Functions](https://vercel.com/docs/functions)
- [Environment Variables](https://vercel.com/docs/environment-variables)

## Summary

Your Panahon Weather App is now:
- ✅ Automatically deployed on every push
- ✅ API is always available (serverless)
- ✅ Fast global performance (CDN)
- ✅ Free to host (Hobby plan)
- ✅ HTTPS enabled
- ✅ No server maintenance needed

Enjoy your production weather app! 🌤️
