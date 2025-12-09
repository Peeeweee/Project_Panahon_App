# 🔌 Port Configuration Guide

## Quick Reference

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Frontend** | 3000 | http://localhost:3000 | ✅ Visit this in your browser |
| **Backend API** | 3001 | http://localhost:3001 | ⚙️ API server (not for browsing) |

## ⚠️ Important

**Always visit:** `http://localhost:3000` (Frontend)

**Don't visit:** `http://localhost:3001` (Backend API - will show "Cannot GET /")

## How the Ports Work

```
┌──────────────────────────────────────────────┐
│   Browser: http://localhost:3000            │
│   (This is where you see the weather app!)  │
└─────────────────┬────────────────────────────┘
                  │
                  ▼
         Frontend (React + Vite)
         Port 3000 - User Interface
                  │
                  │ API Calls
                  ▼
          Backend (Express)
          Port 3001 - API Server
                  │
                  │ Weather Requests
                  ▼
           Open-Meteo API
           (Free Weather Data)
```

## When Running npm run dev

✅ **Frontend only** runs on port **3000**
- Command: `npm run dev`
- Access: http://localhost:3000
- Now includes: `strictPort: true` (won't use other ports)
- New feature: `open: true` (auto-opens browser!)

## When Running npm start

✅ **Both servers** run:
- Frontend: port **3000**
- Backend: port **3001**
- Command: `npm start`
- Access: http://localhost:3000

## Configuration Files

### Frontend Port (3000)

File: `vite.config.ts`

```typescript
server: {
  port: 3000,
  strictPort: true,  // Will error if port is taken
  host: '0.0.0.0',
  open: true,        // Auto-opens browser
}
```

### Backend Port (3001)

File: `server/index.js`

```javascript
const PORT = process.env.PORT || 3001;
```

To change backend port, either:
1. Edit `server/index.js` and change `3001`
2. Or set environment variable: `PORT=3005 npm run server:dev`

## Troubleshooting

### "Port 3000 is already in use"

**Option 1: Kill the process using port 3000**

Windows:
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Linux/Mac:
```bash
lsof -ti:3000 | xargs kill -9
```

**Option 2: Change the port**

Edit `vite.config.ts`:
```typescript
server: {
  port: 3002,  // Change to any available port
  strictPort: true,
  host: '0.0.0.0',
  open: true,
}
```

### "Port 3001 is already in use"

**Option 1: Kill the process**

Windows:
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

Linux/Mac:
```bash
lsof -ti:3001 | xargs kill -9
```

**Option 2: Change backend port**

Edit `server/index.js`:
```javascript
const PORT = process.env.PORT || 3005; // Use 3005 instead
```

**Don't forget to update `.env`:**
```env
VITE_API_URL=http://localhost:3005/api
```

### "Cannot GET /" when visiting localhost:3001

✅ This is **NORMAL**! Port 3001 is the backend API server.

**Solution:** Visit **`http://localhost:3000`** instead!

Port 3001 is only for API endpoints like:
- `http://localhost:3001/api/health`
- `http://localhost:3001/api/weather/location/Tokyo`

### Backend API Not Responding

**Check if backend is running:**

```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{"status":"ok","message":"Panahon API Server is running"}
```

**If not working:**
```bash
# Start backend only
npm run server:dev

# Or start both
npm start
```

## Quick Commands

```bash
# Start frontend only on port 3000
npm run dev

# Start backend only on port 3001
npm run server:dev

# Start both (recommended)
npm start

# Check if ports are in use (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Check if ports are in use (Linux/Mac)
lsof -i :3000
lsof -i :3001
```

## Port Changes Summary

### What I Changed:

1. **Added `strictPort: true`** in `vite.config.ts`
   - Ensures frontend always uses port 3000
   - Will throw error if port is already taken (instead of trying other ports)

2. **Added `open: true`** in `vite.config.ts`
   - Automatically opens browser when you run `npm run dev`
   - No need to manually navigate to http://localhost:3000

3. **Removed old Gemini API config**
   - Cleaned up unused environment variables
   - Removed references to old API keys

---

**Remember:** Always use **http://localhost:3000** for the weather app! 🌤️
