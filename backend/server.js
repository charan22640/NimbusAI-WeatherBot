require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const subscriptionRoutes = require('./routes/subscription');
const { monitorWeather } = require('./services/weatherAlert'); // Updated import

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with debug logging
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    monitorWeather(); // Updated function call
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

app.use('/api/subscription', subscriptionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));