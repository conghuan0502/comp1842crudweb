// controllers/postController.js
const Post = require("../models/post");
const mongoose = require("mongoose");

class PostController {
  // Create new post
  async create(req, res) {
    try {
      const { title, content, tags } = req.body;
      const userId = req.user.id; // From auth middleware

      const post = new Post({
        title,
        content,
        author: userId,
        tags,
      });

      await post.save();
      res.status(201).json(post);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating post", error: error.message });
    }
  }

  // Get all posts with pagination
  async getAllPosts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const posts = await Post.find()
        .populate("author", "username karma")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Post.countDocuments();

      res.json({
        posts,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching posts", error: error.message });
    }
  }

  async getPostById(req, res) {
    const { id } = req.params;
    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Post ID format" });
    }

    try {
      const post = await Post.findById(id).populate("author", "username karma");
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post); // Return the post if found
    } catch (error) {
      console.error("Error fetching post:", error.message);
      res
        .status(500)
        .json({ message: "Error fetching post", error: error.message });
    }
  }


  async updatePost(req, res) {
    try {
      const { id } = req.params; // Get post ID from URL params
      const { title, content } = req.body; // Get updated data from the request body

      // Assuming you have a `Post` model for your posts
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { title, content },
        { new: true } // Return the updated post
      );

      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json({
        message: "Post updated successfully",
        post: updatedPost,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating post", error: error.message });
    }
  }

  async deletePost(req, res) {
    try {
      const { id } = req.params; // Get post ID from URL params

      // Assuming you have a `Post` model for posts
      const deletedPost = await Post.findByIdAndDelete(id);

      if (!deletedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting post", error: error.message });
    }
  }
}

module.exports = PostController;
