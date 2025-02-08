const express = require('express');
const router = express.Router();
const { 
    getRegisterPage, 
    getLoginPage, 
    register, 
    login, 
    logout 
} = require('../controllers/authController');

// GET routes
router.get('/register', getRegisterPage);
router.get('/login', getLoginPage);
router.get('/logout', logout);

// POST routes
router.post('/register', register);
router.post('/login', login);

module.exports = router;