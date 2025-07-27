// src/server.js
import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './src/config/db.js';

// Connect MongoDB before starting server
connectDB();

console.log('🧪 MONGODB_URI from .env:', process.env.MONGODB_URI);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
