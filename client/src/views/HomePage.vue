<template>
    <div class="container mx-auto p-4">
      <div class="mb-4">
        <h1 class="text-2xl font-bold">Welcome to the Blog</h1>
        <p class="text-gray-600">Here are the latest posts:</p>
      </div>
  
      <!-- Login and Register Buttons -->
      <div class="mt-4 flex justify-end space-x-4">
        <router-link 
          to="/login"
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </router-link>
        <router-link 
          to="/register"
          class="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Register
        </router-link>
      </div>
  
      <!-- Button to toggle Create Post Form -->
      <button
        @click="toggleCreateForm"
        class="bg-green-500 text-white p-2 rounded mt-4 hover:bg-green-600"
      >
        Create New Post
      </button>
  
      <!-- Create Post Form (hidden by default) -->
      <div v-if="isCreateFormVisible" class="mt-6 bg-white p-4 rounded shadow-md">
        <h2 class="text-xl font-bold mb-4">Create a New Post</h2>
        <form @submit.prevent="createPost">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              v-model="newPost.title"
              id="title"
              type="text"
              class="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter the post title"
              required
            />
          </div>
          <div class="mt-4">
            <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              v-model="newPost.content"
              id="content"
              class="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter the post content"
              required
            ></textarea>
          </div>
          <div class="mt-4">
            <label for="tags" class="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              v-model="newPost.tags"
              id="tags"
              type="text"
              class="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter tags"
            />
          </div>
          <div class="mt-4 flex justify-end">
            <button
              type="submit"
              class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
  
      <!-- List of Posts -->
      <div v-if="posts.length > 0" class="space-y-4 mt-8">
        <PostItem v-for="post in posts" :key="post._id" :post="post" @deletePost="deletePost" />
      </div>
      <div v-else class="text-center text-gray-500">
        <p>No posts available. Please check back later.</p>
      </div>
  
      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="flex justify-between mt-4">
        <button
          v-if="pagination.currentPage > 1"
          @click="loadPosts(pagination.currentPage - 1)"
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Previous
        </button>
        <button
          v-if="pagination.currentPage < pagination.totalPages"
          @click="loadPosts(pagination.currentPage + 1)"
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import postService from '../services/postService'; // Import the postService
  import PostItem from '../components/post/PostItem.vue'; // Import the PostItem component
  
  export default {
    components: {
      PostItem, 
    },
    data() {
      return {
        posts: [], // Array to store the list of posts
        pagination: null, // Object to store pagination details
        isCreateFormVisible: false, // To toggle form visibility
        newPost: { title: '', content: '', tags: '' }, // Model for new post form data
      };
    },
    methods: {
      async loadPosts(page = 1) {
        try {
          const response = await postService.getPosts(page, 10);
          this.posts = response.data.posts;
          this.pagination = {
            currentPage: response.data.currentPage,
            totalPages: response.data.totalPages,
          };
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      },
  
      toggleCreateForm() {
        this.isCreateFormVisible = !this.isCreateFormVisible;
      },
  
      async createPost() {
        try {
          const response = await postService.createPost(this.newPost);
          if (response.status === 201) {
            alert('Post created successfully!');
            this.loadPosts(); // Reload the posts after creating a new one
            this.newPost = { title: '', content: '', tags: '' }; // Reset the form
            this.isCreateFormVisible = false; // Hide the form after submission
          }
        } catch (error) {
          console.error('Error creating post:', error);
          alert('Failed to create post');
        }
      },
  
      async deletePost(postId) {
        try {
          const response = await postService.deletePost(postId);
  
          if (response.status === 200) {
            this.posts = this.posts.filter(post => post._id !== postId);
            alert('Post deleted successfully!');
          }
        } catch (error) {
          console.error('Error deleting post:', error);
          alert('Failed to delete post');
        }
      },
    },
  
    mounted() {
      this.loadPosts();
    },
  };
  </script>
  