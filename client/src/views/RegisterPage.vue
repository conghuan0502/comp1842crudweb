<template>
    <div class="container mx-auto p-4 max-w-md">
      <h1 class="text-3xl font-bold mb-4">Register</h1>
      
      <form @submit.prevent="submitRegistration" class="space-y-4">
        <div>
          <label for="username" class="block font-medium text-gray-700">Username</label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Your username"
            class="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label for="email" class="block font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Your email"
            class="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label for="password" class="block font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Your password"
            class="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          class="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
  
      <div v-if="errorMessage" class="text-red-500 mt-4">
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import userService from '../services/userService'; // Import the userService for making API calls
  
  export default {
    data() {
      return {
        username: "",
        email: "",
        password: "",
        errorMessage: "",
      };
    },
    methods: {
      async submitRegistration() {
        try {
          // Use the userService to send a POST request to register the user
          const userData = {
            username: this.username,
            email: this.email,
            password: this.password,
          };
          const response = await userService.register(userData);
          
          // On successful registration, redirect to login page
          this.$router.push("/login");
        } catch (error) {
          // Handle error and show an error message
          this.errorMessage = error.response?.data?.message || "There was an error. Please try again.";
        }
      },
    },
  };
  </script>
  
  