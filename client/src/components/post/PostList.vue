<template>
    <div class="space-y-4">
      <!-- List of posts -->
      <PostItem
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @updatePost="updatePost"
        @editPost="editPost"
        @deletePost="deletePost"
      />
    </div>
  </template>
  
  <script>
  import PostItem from "./PostItem.vue";
  
  export default {
    components: {
      PostItem,
    },
    props: {
      posts: Array, 
    },
    methods: {

      updatePost(updatedPost) {
      const index = this.posts.findIndex((post) => post._id === updatedPost._id);
      if (index !== -1) {
        this.$set(this.posts, index, updatedPost);
      }
    },
    
      editPost(postId) {
        this.$router.push({ name: "editPost", params: { id: postId } });
      },
      async deletePost(postId) {
        try {
          await this.$emit("deletePost", postId);
        } catch (error) {
          console.error("Failed to delete post:", error);
        }
      },
    },
  };
  </script>
  
  