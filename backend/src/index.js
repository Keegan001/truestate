require('dotenv').config(); // Load env vars
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const saleRoutes = require('./routes/sales');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
console.log("Attempting to connect to DB..."); // Debug log

if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    // Do not exit process, let Render try to restart or log more errors
  });

// Routes
app.use('/api/sales', saleRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));