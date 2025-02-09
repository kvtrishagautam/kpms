const express = require('express');
const router = express.Router();
const { getLeaveForm, submitLeave, getLeaveHistory } = require('../controllers/leaveController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all leave routes
router.use(authMiddleware);

// Leave routes
router.get('/apply', getLeaveForm);
router.post('/apply', submitLeave);
router.get('/history', getLeaveHistory);


module.exports = router;