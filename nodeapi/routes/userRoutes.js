// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected routes
router.get('/profile', auth, UserController.getProfile);
router.put('/profile', auth, UserController.updateProfile);

module.exports = router;