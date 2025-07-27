import express from 'express';
import cors from 'cors';

const app=express();

app.use(cors()); // ✅ Apply CORS early
app.use(express.json()); // ✅ Parse JSON

// Routes
import authRoutes from './src/routes/auth.routes.js';
import sweetRoutes from './src/routes/sweets.routes.js';
import inventoryRoutes from './src/routes/inventory.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/inventory', inventoryRoutes);


// Health check (optional)
app.get('/', (req, res) => {
  res.send('Sweet Shop API is running...');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;