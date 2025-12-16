# Testing the Setup Process

This document is for maintainers to verify the setup works correctly for new users.

## Test Scenario: Fresh Clone

Simulate what happens when a user clones the repository for the first time.

### Test 1: Fresh Install with `install:all`

```bash
# Cleanup (DO NOT run this on your main project)
rm -rf node_modules
rm -rf server/node_modules
rm .env

# Run the install command
npm run install:all
```

**Expected Output:**
```
# During npm install (frontend):
✅ .env file created from .env.example
📝 Default configuration loaded - no API keys required!

# During server install:
added 83 packages...

# Final setup verification:
✅ .env file already exists
🌤️  Panahon Weather App Setup Complete!
```

**Expected Result:**
- ✅ `node_modules/` created (frontend)
- ✅ `server/node_modules/` created (backend)
- ✅ `.env` file created with default config

---

### Test 2: Starting the Application

```bash
npm start
```

**Expected Output:**
```
🔧 Setting up Panahon Weather App...

✅ .env file already exists
✅ Backend dependencies already installed

🌤️  Panahon Weather App Setup Complete!
🚀 Run "npm start" to launch the application

[server]
[server] > panahon-server@1.0.0 dev
[server] > node --watch index.js
[server]
[server] 🌤️  Panahon API Server running on http://localhost:3001
[frontend]
[frontend] VITE v6.x.x  ready in xxx ms
[frontend]
[frontend]   ➜  Local:   http://localhost:3000/
```

**Expected Result:**
- ✅ Backend running on port 3001
- ✅ Frontend running on port 3000
- ✅ No errors in console
- ✅ App loads successfully in browser

---

### Test 3: Missing Backend Dependencies

```bash
# Remove only backend dependencies
rm -rf server/node_modules

# Run npm start
npm start
```

**Expected Output:**
```
🔧 Setting up Panahon Weather App...

✅ .env file already exists

📦 Installing backend dependencies...
[npm install output...]
✅ Backend dependencies installed

🌤️  Panahon Weather App Setup Complete!
🚀 Run "npm start" to launch the application

[Both servers start successfully...]
```

**Expected Result:**
- ✅ Backend dependencies automatically installed
- ✅ Both servers start without manual intervention

---

### Test 4: Missing .env File

```bash
# Remove .env file
rm .env

# Run npm start
npm start
```

**Expected Output:**
```
🔧 Setting up Panahon Weather App...

✅ Created .env file from .env.example
📝 Default configuration loaded - no API keys required!
✅ Backend dependencies already installed

🌤️  Panahon Weather App Setup Complete!
[Both servers start...]
```

**Expected Result:**
- ✅ `.env` file automatically created
- ✅ Both servers start successfully

---

## Manual Testing Checklist

After running the setup, verify:

### Backend API Testing

1. **Test weather by location:**
   ```bash
   curl http://localhost:3001/api/weather/location/Tokyo
   ```
   Expected: JSON response with weather data for Tokyo

2. **Test weather by coordinates:**
   ```bash
   curl "http://localhost:3001/api/weather/coordinates?lat=35.6762&lon=139.6503"
   ```
   Expected: JSON response with weather data

### Frontend Testing

1. Open browser: `http://localhost:3000`
2. Click "Continue" button
3. Click on any country on the map
4. Verify weather card appears with:
   - Location name
   - Temperature
   - Weather condition
   - Humidity
   - Wind speed
   - Description

### Error Scenarios

1. **Port already in use:**
   - Expected: Clear error message
   - User should stop conflicting service or change ports

2. **Network issues:**
   - Expected: "Failed to fetch" error in frontend
   - Check backend is running on port 3001

## Common Issues and Solutions

### Issue: "Cannot find module"
**Cause:** Dependencies not installed
**Solution:** Run `npm run install:all`

### Issue: "Port 3000/3001 already in use"
**Cause:** Another process using the port
**Solution:**
```bash
# Windows: Find and kill process
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Linux/Mac: Find and kill process
lsof -ti:3000 | xargs kill -9
```

### Issue: "Failed to fetch weather data"
**Cause:** Backend not running
**Solution:**
1. Check backend console for errors
2. Verify backend is on port 3001
3. Check `.env` has correct `VITE_API_URL`

### Issue: ".env file not created"
**Cause:** `.env.example` missing or setup script not running
**Solution:**
1. Verify `.env.example` exists
2. Run `npm run setup` manually
3. Or copy manually: `cp .env.example .env`

## Success Criteria

The setup is successful if:

- ✅ User can clone repo and run with just 2 commands
- ✅ No manual `.env` configuration needed
- ✅ No API keys required
- ✅ Both servers start automatically
- ✅ Weather data loads in the app
- ✅ Clear error messages for any issues
- ✅ Documentation is accurate and helpful

## Version Compatibility

Tested with:
- Node.js: v18+ (v20 recommended)
- npm: v9+ (v10 recommended)
- OS: Windows 11, macOS 13+, Ubuntu 22.04+

## API Health Check

Verify the free APIs are working:

1. **Open-Meteo Weather API:**
   ```bash
   curl "https://api.open-meteo.com/v1/forecast?latitude=35.6762&longitude=139.6503&current=temperature_2m"
   ```

2. **Open-Meteo Geocoding:**
   ```bash
   curl "https://geocoding-api.open-meteo.com/v1/search?name=Tokyo"
   ```

3. **BigDataCloud Geocoding:**
   ```bash
   curl "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=35.6762&longitude=139.6503"
   ```

All should return valid JSON responses (no API key needed).
