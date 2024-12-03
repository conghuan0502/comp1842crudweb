// routes/index.js
const express = require('express');
const router = express.Router();

// Import routes
router.use('/users', require('./userRoutes'));
router.use('/posts', require('./postRoutes'));
router.use('/comments', require('./commentRoutes'));

module.exports = router;