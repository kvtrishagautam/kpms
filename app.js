// app.js
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Use routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/', dashboardRoutes);
app.use('/leave', leaveRoutes);
app.use('/departments', departmentRoutes);

// ✅ Export `app` instead of running `app.listen()`
module.exports = app;
