const express = require('express');
const router = express.Router();
const { getDashboard, getProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all user routes
router.use(authMiddleware);

// User routes
router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);

module.exports = router;