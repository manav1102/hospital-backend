const express = require('express');
const router = express.Router();
const authController = require('../controller/authController.js'); // Ensure this file exists and exports functions

router.post('/login', authController.loginUser);  // Ensure login function is defined in authController
router.post('/register', authController.registerUser);  // Ensure register function is defined in authController

module.exports = router;
