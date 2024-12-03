<template>
  <div class="container mx-auto p-4">
    <!-- Back to Home Button -->
    <div class="mb-6">
      <router-link
        to="/"
        class="bg-gray-200 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-300"
      >
        Back to Home
      </router-link>
    </div>
    <!-- Comments Section -->
    <div class="mt-6">
      <h2 class="text-2xl font-semibold mb-4">Comments</h2>
      <div v-if="comments.length > 0" class="space-y-4">
        <div
          v-for="comment in comments"
          :key="comment._id"
          class="p-4 border rounded-lg"
        >
          <p class="font-semibold">{{ comment.author.username }}</p>
          <p class="text-gray-600">{{ comment.content }}</p>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    </div>

    <!-- Add a comment form (if logged in) -->
    <div v-if="isAuthenticated" class="mt-6">
      <h3 class="text-lg font-semibold">Add a Comment</h3>
      <textarea
        v-model="newComment"
        placeholder="Write your comment..."
        class="w-full p-2 border rounded-lg mt-2"
      ></textarea>
      <button
        @click="submitComment"
        class="bg-blue-500 text-white p-2 rounded mt-2"
      >
        Submit Comment
      </button>
    </div>
    <div v-else class="mt-6 text-center">
      <p class="text-gray-500">Please login to post a comment.</p>
    </div>
  </div>
</template>

<script>
import commentService from "../services/commentService";

export default {
  data() {
    return {
      post: null, // The post to display
      comments: [], // List of comments for the post
      newComment: "", // New comment to be submitted
      isAuthenticated: false, // Check if the user is authenticated
    };
  },

  created() {
    const postId = this.$route.params.id;
    console.log("Post ID:", postId); // Get the post ID from the URL
    this.fetchComments(postId);
    this.checkAuthentication();
  },
  methods: {
    async fetchComments(postId) {
      try {
        const response = await commentService.getCommentsForPost(postId);
        console.log("Fetched comments:", response);
        if (response && Array.isArray(response)) {
          this.comments = response; // Update comments array if it's an array
        } else {
          console.error("No comments found for this post.");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },

    async submitComment() {
      if (!this.newComment.trim()) return;

      try {
        const postId = this.$route.params.id;
        const commentData = { content: this.newComment };

        console.log("Submitting comment:", commentData);

        const response = await commentService.addCommentToPost(
          postId,
          commentData
        );

        console.log("Response after submitting comment:", response);

        if (response) {
          this.comments.push(response); // Push the returned comment object
          this.newComment = ""; // Clear input after submission
        } else {
          console.error(
            "Failed to add comment. Response is null or undefined."
          );
        }
      } catch (error) {
        console.error(
          "Error posting comment:",
          error.response ? error.response.data : error.message
        );
      }
    },

    checkAuthentication() {
      const token = localStorage.getItem("authToken");
      this.isAuthenticated = !!token; // Set isAuthenticated to true if token exists
    },

    goToHome() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style scoped>
button:hover {
  transition: background-color 0.3s ease;
}
</style>
