<template>
    <div class="container mx-auto p-4 max-w-lg">
      <h1 class="text-3xl font-bold mb-4">{{ isEdit ? "Edit Post" : "Create New Post" }}</h1>
      
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="title" class="block font-medium text-gray-700">Title</label>
          <input
            v-model="post.title"
            type="text"
            id="title"
            placeholder="Enter post title"
            class="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label for="body" class="block font-medium text-gray-700">Body</label>
          <textarea
            v-model="post.body"
            id="body"
            placeholder="Enter post content"
            class="w-full p-2 border rounded"
          ></textarea>
        </div>
        <button
          type="submit"
          class="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
        >
          {{ isEdit ? "Update Post" : "Create Post" }}
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import postService from "../../services/postService";
  
  export default {
    data() {
      return {
        post: {
          title: "",
          body: "",
        },
        isEdit: false, 
      };
    },
    created() {
      const postId = this.$route.params.id;
      if (postId) {
        this.isEdit = true;
        this.fetchPost(postId); 
      }
    },
    methods: {
      async fetchPost(postId) {
        try {
          const response = await postService.getPostById(postId);
          this.post = response.data;
        } catch (error) {
          console.error("Error fetching post for editing:", error);
        }
      },
      async submitForm() {
        try {
          if (this.isEdit) {
            await postService.updatePost(this.post.id, this.post);
          } else {
            await postService.createPost(this.post);
          }
          this.$router.push("/");
        } catch (error) {
          console.error("Error submitting post:", error);
        }
      },
    },
  };
  </script>