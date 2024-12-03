import api from '../plugin/axios'; // Import the Axios instance from axios.js

const postService = {
  getPosts(page = 1, limit = 10) {
    return api.get('/posts', {
      params: { page, limit },
    });
  },

  getPostById(postId) {
    return api.get(`/api/posts/${postId}`); // Get the post by its ID
  },

  createPost(postData) {
    // Add authorization token to the headers
    const token = localStorage.getItem('token');
    return api.post('/posts', postData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to Authorization header
      },
    });
  },

  updatePost(postId, postData) {
    return api.put(`/posts/${postId}`, postData); // PUT request to update a post
  },

  deletePost(postId) {
    return api.delete(`/posts/${postId}`); // DELETE request to delete the post
  },
};

export default postService;
