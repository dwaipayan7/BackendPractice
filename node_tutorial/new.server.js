const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();  // Ensure .env variables are loaded
const passport = require('./auth/auth');

// Connect to the database
const PORT = process.env.PORT || 4000;
connectDB();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware function to log requests
const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} - Request made to: ${req.url}`);
    next();
};

// Initialize Passport
app.use(passport.initialize());
app.use(logRequest); // Apply to every request

// Authentication middleware using Passport
const localAuthMiddleware = passport.authenticate('local', { session: false });

// Routes
app.get('/', (req, res) => {
    res.send("Welcome to our hotel");
});


const personRoutes = require('./router/personRouter');
const menuRoutes = require('./router/menuRoutes');

app.use('/person', personRoutes); 
app.use('/menu', menuRoutes);     


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
