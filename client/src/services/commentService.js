import api from '../plugin/axios'; // Import the Axios instance from axios.js

const commentService = {

  async getCommentsForPost(postId) {
    try {
      const response = await api.get(`/comments/post/${postId}`);
      return response.data; // Return the data from the response
    } catch (error) {
      console.error('Error fetching comments for post:', error);
      throw error; // Rethrow the error for further handling
    }
  },

  async addCommentToPost(postId, commentData) {
    try {
      const response = await api.post(`/comments/post/${postId}`, commentData);
      console.log("API response for adding comment:", response);
      return response.data; // Return the data from the response
    } catch (error) {
      console.error('Error adding comment to post:', error);
      throw error; // Rethrow the error for handling
    }
  },

  
  async updateComment(commentId, commentData) {
    try {
      const response = await api.put(`/comments/${commentId}`, commentData);
      return response.data; // Return the data from the response
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error; // Rethrow the error for handling
    }
  },

  async deleteComment(commentId) {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data; // Return the data from the response
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error; // Rethrow the error for handling
    }
  },
};

export default commentService;
