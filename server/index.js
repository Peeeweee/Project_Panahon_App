import express from 'express';
import cors from 'cors';
import weatherRoutes from './routes/weather.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/weather', weatherRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Panahon API Server is running' });
});

app.listen(PORT, () => {
  console.log(`🌤️  Panahon API Server running on http://localhost:${PORT}`);
});
