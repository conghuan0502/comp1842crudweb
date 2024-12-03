// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const { CommentController } = require('../controllers');
const auth = require('../middleware/auth');

// Public routes
router.get('/post/:postId', CommentController.getPostComments);

// Protected routes
router.post('/post/:postId', auth, CommentController.create);
router.put('/:id', auth, CommentController.updateComment);
router.delete('/:id', auth, CommentController.deleteComment);

module.exports = router;