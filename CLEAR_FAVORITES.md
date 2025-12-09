# 🧹 Clear Old Favorites

## Quick Fix for Coordinate-Based Favorites

If you have old favorites showing coordinates (e.g., "7.05, 125.56"), clear them:

### Option 1: Clear in Browser Console
1. Open browser console (F12)
2. Run this command:
```javascript
localStorage.removeItem('panahon_favorites');
location.reload();
```

### Option 2: Clear Manually
1. Hover over each coordinate favorite
2. Click the red **X** button
3. They'll be removed one by one

### Option 3: Clear All Browser Data
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cookies and other site data"
3. Choose "localhost:3000"
4. Click "Clear data"

---

After clearing, add new favorites:
1. Click location pin or search for a city
2. Weather card will show proper name (e.g., "Davao City, Davao Region, Philippines")
3. Click ⭐ to add to favorites
4. Now it will work correctly!
