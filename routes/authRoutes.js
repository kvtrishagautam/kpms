const express = require('express');
const router = express.Router();
const { 
    getRegisterPage, 
    getLoginPage, 
    register, 
    login, 
    logout,updatePendingLeaves,setPendingLeaves
} = require('../controllers/authController');

// GET routes
router.get('/register', getRegisterPage);
router.get('/login', getLoginPage);
router.get('/logout', logout);

// POST routes
router.post('/register', register);
router.post('/login', login);

//admin
// router.get('/admin/dashboard', adminDashboard);
router.get('/admin/dashboard', setPendingLeaves);
router.post('/admin/dashboard', updatePendingLeaves);

module.exports = router;