// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { PostController } = require('../controllers');
const auth = require('../middleware/auth');

// Public routes
router.get('/', PostController.getAllPosts);
router.get('/posts/:id', PostController.getPostById);

// Protected routes
router.post('/', auth, PostController.create);
router.put('/:id', auth, PostController.updatePost);
router.delete('/:id', auth, PostController.deletePost);

module.exports = router;