// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware
router.use(authMiddleware);

// Dashboard routes
router.get('/', dashboardController.getDashboard);
router.post('/dashboard/clock-in', dashboardController.clockIn);
router.post('/dashboard/clock-out', dashboardController.clockOut);
router.get('/dashboard/attendance-status', dashboardController.getAttendanceStatus);

module.exports = router;