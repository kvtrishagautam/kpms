const express = require('express');
const router = express.Router();
const { 
    getRegisterPage, 
    getLoginPage, 
    register, 
    login, 
    logout,adminDashboard,setPendingLeaves
} = require('../controllers/authController');

// GET routes
router.get('/register', getRegisterPage);
router.get('/login', getLoginPage);
router.get('/logout', logout);

// POST routes
router.post('/register', register);
router.post('/login', login);

//admin
router.get('/admin/dashboard', adminDashboard);
router.post('/admin/dashboard', setPendingLeaves);

module.exports = router;