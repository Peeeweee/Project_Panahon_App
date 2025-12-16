# 🚀 Quick Setup Guide

## For Users Cloning This Repository

### ⚡ Super Quick Start (Just 2 commands!)

```bash
npm run install:all
npm start
```

**That's it!** The setup will automatically:
- ✅ Install frontend dependencies
- ✅ Install backend dependencies
- ✅ Create `.env` configuration file
- ✅ Start both servers

No manual configuration needed!

---

## What Happens Automatically?

When you run `npm install` or `npm start`, the setup script:

1. ✅ Creates a `.env` file from `.env.example` (if it doesn't exist)
2. ✅ Sets the default API URL to `http://localhost:3001/api`
3. ✅ **No API keys needed!** The app uses free weather APIs

---

## 🎉 No API Keys Required

This project uses completely **free, open-source APIs**:

- **[Open-Meteo](https://open-meteo.com)** - Weather data (no key required)
- **[BigDataCloud](https://www.bigdatacloud.com/)** - Reverse geocoding (no key required)

You can clone and run this project immediately without signing up for any services!

---

## Detailed Installation Steps

If you want to understand what's happening:

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Project_Panahon_App
```

### 2. Install Dependencies

```bash
npm run install:all
```

This installs dependencies for both:
- Frontend (React + Vite)
- Backend (Express server)

And automatically runs the setup script.

### 3. Start the Application

```bash
npm start
```

This starts:
- **Backend**: `http://localhost:3001` (Express API server)
- **Frontend**: `http://localhost:3000` (Vite dev server)

### 4. Open in Browser

Navigate to `http://localhost:3000` and start exploring weather around the world!

---

## Troubleshooting

### "Cannot connect to API"

Make sure both servers are running. You should see output like:

```
[server] Server running on http://localhost:3001
[frontend] Local: http://localhost:3000
```

### Port Already in Use

If port 3000 or 3001 is already taken:

- **Change frontend port**: Edit `vite.config.ts`
- **Change backend port**: Edit `server/index.js` or set `PORT=3002` environment variable

Then update `VITE_API_URL` in `.env` to match the new backend port.

### Missing .env File

Run the setup manually:

```bash
npm run setup
```

Or copy manually:

```bash
cp .env.example .env
```

---

## Development Commands

```bash
# Run both frontend and backend together
npm start

# Run frontend only
npm run dev

# Run backend only
npm run server:dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run setup script manually
npm run setup
```

---

## Environment Variables

The only environment variable needed is in `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

This tells the frontend where the backend server is located.

**No API keys needed!** 🎉

---

## What Makes This Easy to Clone?

1. **Auto-setup**: `.env` is created automatically
2. **Free APIs**: No API keys or accounts required
3. **One command**: `npm run install:all && npm start`
4. **Clear documentation**: Step-by-step guides included

---

Happy weather exploring! 🌤️
