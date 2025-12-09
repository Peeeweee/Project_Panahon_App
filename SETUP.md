# 🚀 Quick Setup Guide

## What Changed?

✅ **Removed**: Google Gemini API (was causing API key errors)
✅ **Added**: Express.js backend server
✅ **Added**: Open-Meteo free weather API (NO API key required!)

## Installation & Running

### Step 1: Install Dependencies

```bash
npm run install:all
```

This installs both frontend and backend dependencies.

### Step 2: Start the Application

```bash
npm start
```

This starts both servers:
- **Backend**: `http://localhost:3001` (Express API server)
- **Frontend**: `http://localhost:3000` (Vite dev server)

### Step 3: Open in Browser

Navigate to: **`http://localhost:3000`**

## How It Works

```
┌─────────────┐         ┌─────────────┐         ┌──────────────┐
│   Browser   │────────▶│   Express   │────────▶│  Open-Meteo  │
│  (Port 3000)│         │  (Port 3001)│         │     API      │
└─────────────┘◀────────└─────────────┘◀────────└──────────────┘
   React App             Backend Server         Free Weather Data
```

1. Frontend (React) sends request to backend
2. Backend (Express) fetches data from Open-Meteo API
3. Backend returns formatted weather data to frontend
4. Frontend displays beautiful weather card

## API Endpoints

### Backend Server

- **Health Check**: `GET http://localhost:3001/api/health`
- **Weather by Location**: `GET http://localhost:3001/api/weather/location/:location`
  - Example: `/api/weather/location/Tokyo`
- **Weather by Coordinates**: `GET http://localhost:3001/api/weather/coordinates?lat=14.5995&lon=120.9842`
  - Example: `/api/weather/coordinates?lat=14.5995&lon=120.9842`

### Test the API

```bash
# Test with Tokyo
curl http://localhost:3001/api/weather/location/Tokyo

# Test with Manila
curl http://localhost:3001/api/weather/location/Manila

# Test with coordinates (Davao City)
curl "http://localhost:3001/api/weather/coordinates?lat=7.1907&lon=125.4553"
```

## Features

✨ **No API Key Required** - Open-Meteo is completely free!
✨ **Fast Response** - Direct API calls from backend
✨ **Real-time Data** - Fresh weather data from national weather services
✨ **Multiple Search Methods** - Search by city name or coordinates
✨ **Beautiful UI** - Same aesthetic design with smooth animations

## Troubleshooting

### Port Already in Use

If port 3000 or 3001 is already in use:

**Frontend (3000)**: Edit `vite.config.ts`
```typescript
server: {
  port: 3002, // Change to any available port
  host: '0.0.0.0'
}
```

**Backend (3001)**: Edit `server/index.js`
```javascript
const PORT = process.env.PORT || 3005; // Change to any available port
```

Don't forget to update `.env` file with the new backend URL!

### Backend Not Starting

Make sure you installed backend dependencies:
```bash
cd server
npm install
```

### Frontend Can't Connect to Backend

Check `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

## Development Scripts

- `npm start` - Run both servers (recommended)
- `npm run dev` - Run frontend only
- `npm run server:dev` - Run backend only
- `npm run build` - Build for production
- `npm run install:all` - Install all dependencies

## Tech Stack

**Frontend**
- React 19.2.1
- TypeScript
- Vite
- D3.js (for map)
- Tailwind CSS

**Backend**
- Node.js
- Express
- CORS enabled
- Open-Meteo API integration

---

🎉 **You're all set! Enjoy exploring weather around the world!**
