const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const setSubscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Add CORS middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with updated options
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,  // This addresses the ensureIndex deprecation warning
    useFindAndModify: false
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
setSubscriptionRoutes(app);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});