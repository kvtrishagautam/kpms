// app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret:'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Use routes - correct way
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/', dashboardRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});