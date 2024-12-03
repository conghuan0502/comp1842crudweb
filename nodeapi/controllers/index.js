// controllers/index.js
const UserController = require('./userController');
const PostController = require('./postController'); 
const CommentController = require('./commentController'); 

module.exports = {
    UserController: new UserController(),
    PostController: new PostController(),
    CommentController: new CommentController()
  };