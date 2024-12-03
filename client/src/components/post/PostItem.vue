<template>
  <div class="p-4 border rounded-lg shadow-md hover:shadow-lg">
    <!-- Post Title -->
    <h2 class="text-xl font-semibold">
      <span v-if="isEditing">
        <input
          v-model="editedPost.title"
          class="text-xl font-semibold w-full p-2"
        />
      </span>
      <span v-else>{{ post.title }}</span>
    </h2>

    <!-- Post Content -->
    <p class="text-gray-700 mt-2">
      <span v-if="isEditing">
        <textarea
          v-model="editedPost.content"
          class="w-full p-2 h-24"
        ></textarea>
      </span>
      <span v-else>{{ post.content }}</span>
    </p>

    <!-- Post Tags -->
    <div class="mt-4">
      <span
        v-for="tag in post.tags"
        :key="tag"
        class="inline-block bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full mr-2"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Buttons for Edit/Delete -->
    <div class="mt-4 flex justify-between items-center">
      <div class="flex space-x-2">
        <button
          v-if="isEditing"
          @click="savePost"
          class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          v-if="isEditing"
          @click="cancelEdit"
          class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          v-else
          @click="editPost"
          class="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          @click="deletePost"
          class="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
    <router-link
      :to="'/post/' + post._id"
      class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
    >
      View Comments
    </router-link>
  </div>
</template>

<script>
import postService from "../../services/postService";

export default {
  name: "PostItem",
  props: {
    post: {
      type: Object,
      required: true,
      validator(post) {
        return post.title && post.score !== undefined && post._id;
      },
    },
  },
  data() {
    return {
      isEditing: false, // Track whether the post is being edited
      editedPost: {
        // Store the edited post temporarily
        title: this.post.title,
        content: this.post.content,
      },
    };
  },
  methods: {
    // Method to start editing the post
    editPost() {
      this.isEditing = true; // Set editing flag to true to display the edit form
      this.editedPost = {
        title: this.post.title,
        content: this.post.content,
      }; // Pre-fill the form with current post data
    },

    // Method to save the edited post
    async savePost() {
      try {
        const updatedPostData = {
          title: this.editedPost.title,
          content: this.editedPost.content,
        };

        // Call the API to update the post
        const response = await postService.updatePost(
          this.post._id,
          updatedPostData
        );

        // Replace the post object to ensure reactivity
        this.$emit("updatePost", { ...this.post, ...response.data });

        // Exit editing mode
        this.isEditing = false;
      } catch (error) {
        console.error("Error saving the post:", error);
        alert("Failed to save the post. Please try again.");
      }
    },

    // Method to cancel editing
    cancelEdit() {
      this.isEditing = false; // Exit editing mode without saving
    },

    // Method to delete the post
    async deletePost() {
      if (confirm("Are you sure you want to delete this post?")) {
        this.$emit("deletePost", this.post._id); // Emit an event to trigger the delete action in parent
      }
    },
  },
};
</script>
