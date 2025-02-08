const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware
router.use(authMiddleware);

// Dashboard routes
router.get('/', dashboardController.getDashboard);
router.post('/clock-in', dashboardController.clockIn);
router.post('/update-task', dashboardController.updateTaskStatus);

module.exports = router;