# 🌤️ Panahon - Aesthetic Weather App

A beautiful, interactive weather application featuring a world map explorer and real-time weather data powered by Open-Meteo API.

> **🚀 Just want to get started?** See [QUICK_SETUP.md](QUICK_SETUP.md) for a 2-command setup!

## 🎉 No API Keys Required!

This project is ready to run out of the box! Clone it and start immediately - no API keys, no sign-ups, no configuration hassles. Uses 100% free weather APIs.

## ✨ Features

- **Interactive World Map**: Click on any country to get weather information
- **Real-time Weather Data**: Powered by Open-Meteo's free API (no API key required!)
- **Beautiful UI/UX**: Smooth animations, glass-morphism design, and responsive layout
- **Search Functionality**: Search for any city or location worldwide
- **Animated Weather Icons**: Contextual animations for different weather conditions

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Setup

**⚡ One-Command Setup (Recommended)**

Clone and run - no configuration needed!

```bash
# Clone the repository
git clone <your-repo-url>
cd Project_Panahon_App

# Install all dependencies (frontend + backend, creates .env automatically)
npm run install:all

# Start both servers
npm start
```

**That's it!** The setup automatically:
- ✅ Installs frontend dependencies
- ✅ Installs backend dependencies
- ✅ Creates `.env` configuration file
- ✅ Starts both frontend (port 3000) and backend (port 3001) servers

**No API keys, no manual configuration required!**

---

**Manual Installation** (if needed):

1. **Install all dependencies** (both frontend and backend):
   ```bash
   npm run install:all
   ```

   Or install separately:
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

2. **Setup is automatic!** The `.env` file will be created automatically from `.env.example` when you install or start the app.

### Running the Application

**Option 1: Run both servers concurrently (Recommended)**
```bash
npm start
```

This will:
- ✅ Auto-setup configuration (if needed)
- 🚀 Start backend server on `http://localhost:3001`
- 🚀 Start frontend dev server on `http://localhost:3000`

**Option 2: Run servers separately**

Terminal 1 (Backend):
```bash
npm run server:dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
Project_Panahon_App/
├── components/          # React UI components
│   ├── WorldMap.tsx          # Interactive D3 world map
│   ├── WeatherCard.tsx       # Weather display card
│   ├── Header.tsx            # Navigation header
│   └── CountryTransition.tsx # Animation overlay
├── services/           # API integration
│   └── weatherService.ts     # Frontend weather API client
├── server/             # Backend Express server
│   ├── index.js             # Server entry point
│   ├── routes/
│   │   └── weather.js       # Weather API routes
│   └── services/
│       └── weatherService.js # Open-Meteo API integration
├── App.tsx             # Main React application
├── types.ts            # TypeScript type definitions
└── package.json        # Frontend dependencies
```

## 🔧 Technology Stack

### Frontend
- **React 19.2.1** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **D3.js** - Interactive map visualization
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Open-Meteo API** - Weather data provider (FREE, no API key needed!)

## 🌐 API Endpoints

### Backend API

**Base URL**: `http://localhost:3001/api`

#### Get Weather by Location Name
```
GET /weather/location/:location
```
Example: `/weather/location/Tokyo`

#### Get Weather by Coordinates
```
GET /weather/coordinates?lat=35.6762&lon=139.6503
```

### Response Format
```json
{
  "location": "Tokyo, Japan",
  "isoCode": "JPN",
  "temperature": "18°C",
  "condition": "Partly Cloudy",
  "humidity": "65%",
  "wind": "12 km/h",
  "description": "A nice mix of sun and clouds.",
  "sources": [
    {
      "title": "Open-Meteo Weather API",
      "uri": "https://open-meteo.com"
    }
  ],
  "timestamp": "2025-12-09T10:00",
  "timezone": "Asia/Tokyo"
}
```

## 🎨 Features & Usage

1. **Landing Page**: Click "Continue" to start exploring
2. **Map Interaction**: Click on any country on the map to get its weather
3. **Search**: Use the search icon (top right) to search for specific cities
4. **Weather Card**: View detailed weather information with animated icons
5. **Close Card**: Click the X button to return to the map

## 🆓 Why Open-Meteo?

Open-Meteo is a free, open-source weather API that:
- Requires **NO API key**
- Has **NO rate limits** for reasonable use
- Provides **high-quality, accurate data** from national weather services
- Is **completely free** for non-commercial use
- Offers **fast response times**

## 🛠️ Development

### Scripts

- `npm start` - Run both frontend and backend concurrently
- `npm run dev` - Run frontend only (Vite dev server)
- `npm run server:dev` - Run backend only (with hot reload)
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run install:all` - Install all dependencies

### Environment Variables

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

## 🐛 Troubleshooting

### "Failed to fetch weather data"
- Make sure the backend server is running on port 3001
- Check that the frontend `.env` file has the correct `VITE_API_URL`

### Port already in use
- Frontend (3000): Change in `vite.config.ts`
- Backend (3001): Change in `server/index.js` or set `PORT` environment variable

### CORS errors
- Make sure CORS is enabled in the backend (already configured)
- Check that the API URL in frontend matches the backend URL

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Credits

- Weather data provided by [Open-Meteo](https://open-meteo.com)
- Map data from [World Atlas](https://github.com/topojson/world-atlas)
- Built with React, TypeScript, and Express

---

Made with ❤️ using Open-Meteo's free weather API
