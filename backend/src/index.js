const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const saleRoutes = require('./routes/sales');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// PASTE YOUR WORKING CONNECTION STRING FROM seed.js HERE
const MONGO_URI = 'mongodb+srv://divyam:pass@cluster0.nwthydx.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Connection Error:', err));

// Routes
app.use('/api/sales', saleRoutes);

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));