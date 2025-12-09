# ⚡ Quick Start - Panahon Weather App

## 🎯 What You Need to Know

**The API Problem is FIXED!** ✅

- ❌ **Old**: Required Google Gemini API key (was failing with 400 error)
- ✅ **New**: Uses FREE Open-Meteo API (no key needed!)

## 🚀 Three Simple Steps

### 1️⃣ Install Everything

```bash
npm run install:all
```

This installs both frontend and backend dependencies in one command.

### 2️⃣ Start the App

```bash
npm start
```

This starts both servers:
- 🌐 **Frontend**: http://localhost:3000 (Your browser UI) ← **Visit this one!**
- 🔧 **Backend**: http://localhost:3001 (API server only - don't visit)

### 3️⃣ Open in Browser

Visit: **http://localhost:3000**

⚠️ **Important:**
- ✅ **Correct**: http://localhost:3000 (frontend - shows weather app)
- ❌ **Wrong**: http://localhost:3001 (backend API - shows "Cannot GET /")

**That's it!** 🎉

**New:** Browser now opens automatically when you run `npm start` or `npm run dev`!

## 📱 How to Use

1. Click **"Continue"** on the landing page
2. Click any **country on the map** to see its weather
3. Or click the **search icon** (top right) to search for a city
4. Click **X** to close the weather card and explore more

## 🧪 Test the API (Optional)

Want to test the backend directly?

```bash
# Test with Manila
curl http://localhost:3001/api/weather/location/Manila

# Test with Davao
curl http://localhost:3001/api/weather/location/Davao

# Test with Tokyo
curl http://localhost:3001/api/weather/location/Tokyo
```

## ✨ Features

- 🗺️ **Interactive World Map** - Click any country
- 🔍 **Search** - Find weather for any city
- 🎨 **Animated Icons** - Rain, snow, clouds, sun animations
- 📱 **Responsive** - Works on mobile and desktop
- ⚡ **Fast** - Real-time data from Open-Meteo
- 🆓 **FREE** - No API key required!

## 🐛 Common Issues

### "Port already in use"

**Solution**: Close other apps using ports 3000 or 3001, or change ports:

- Frontend port: Edit `vite.config.ts`
- Backend port: Edit `server/index.js`

### "Failed to fetch weather data"

**Solution**: Make sure both servers are running:

```bash
npm start
```

You should see:
```
🌤️  Panahon API Server running on http://localhost:3001
VITE ready in XXX ms
```

### Backend not starting

**Solution**: Install backend dependencies:

```bash
cd server
npm install
cd ..
npm start
```

## 📂 Project Structure

```
Project_Panahon_App/
├── components/         ← React UI components
├── services/          ← API calls to backend
├── server/            ← Express backend (NEW!)
│   ├── routes/       ← API endpoints
│   └── services/     ← Open-Meteo integration
└── App.tsx           ← Main React app
```

## 🔧 Development Commands

```bash
npm start          # Run both frontend + backend (recommended)
npm run dev        # Run frontend only
npm run server:dev # Run backend only
npm run build      # Build for production
```

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Map | D3.js + TopoJSON |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Weather Data | Open-Meteo API (FREE!) |

## 📊 API Response Example

```json
{
  "location": "Tokyo, Japan",
  "isoCode": "JP",
  "temperature": "18°C",
  "condition": "Clear",
  "humidity": "65%",
  "wind": "12 km/h",
  "description": "A beautiful clear day with 18°C. Perfect weather for outdoor activities.",
  "sources": [{
    "title": "Open-Meteo Weather API",
    "uri": "https://open-meteo.com"
  }],
  "timestamp": "2025-12-09T14:45",
  "timezone": "Asia/Tokyo"
}
```

## 🌟 Why Open-Meteo?

✅ **Completely FREE** - No API key, no credit card
✅ **No Rate Limits** - Unlimited requests for reasonable use
✅ **High Quality Data** - From national weather services
✅ **Fast & Reliable** - 99.9% uptime
✅ **Open Source** - Transparent and community-driven

## 📚 More Info

- Full docs: See [README.md](README.md)
- Setup guide: See [SETUP.md](SETUP.md)
- Migration details: See [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)

---

**Ready to explore the weather?** 🌤️

Run `npm start` and visit http://localhost:3000

**Sources:**
- [Free Open-Source Weather API | Open-Meteo.com](https://open-meteo.com/)
- [Best Weather API for 2025: Free & Paid Options Compared](https://www.visualcrossing.com/resources/blog/best-weather-api-for-2025/)
