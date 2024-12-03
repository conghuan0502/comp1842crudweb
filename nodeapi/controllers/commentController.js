// controllers/commentController.js
const Comment = require('../models/comment');
const Post = require('../models/post');

class CommentController {
  // Create comment
  async create(req, res) {
    try {
      const { postId } = req.params;
      const { content, parentCommentId } = req.body;
      const userId = req.user.id;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const comment = new Comment({
        content,
        author: userId,
        post: postId,
        parentComment: parentCommentId || null
      });

      await comment.save();

      // Add comment to post's comments array
      post.comments.push(comment._id);
      await post.save();

      await comment.populate('author', 'username karma');
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
  }

  async getPostComments(req, res) {
    try {
      const { postId } = req.params;

      // Fetch comments for the specific post, populate the author and post fields
      const comments = await Comment.find({ post: postId })
          .populate('author', 'username karma')
          .populate('post', 'title content');

      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
  }

  // Update a comment by its ID
  async updateComment(req, res) {
    try {
      const { content } = req.body;
      const { id } = req.params;

      // Check if content is provided
      if (!content) {
        return res.status(400).json({ message: 'Comment content is required' });
      }

      // Find and update the comment
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { content },
        { new: true } // Return the updated comment
      );

      if (!updatedComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      res.json({ message: 'Comment updated successfully', updatedComment });
    } catch (error) {
      res.status(500).json({ message: 'Error updating comment', error: error.message });
    }
  }

  // Delete a comment by its ID
  async deleteComment(req, res) {
    try {
      const { id } = req.params;

      // Find the comment to delete
      const deletedComment = await Comment.findByIdAndDelete(id);
      if (!deletedComment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      // Also remove the comment from the post's comments array
      const post = await Post.findById(deletedComment.post);
      post.comments.pull(deletedComment._id);
      await post.save();

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
  }
}

module.exports = CommentController;
