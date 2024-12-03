// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import PostPage from '../views/PostPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import PostForm from '../components/post/PostForm.vue'; // For adding and editing posts

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: PostPage,
    props: true, // Pass route params as props
  },
  {
    path: '/post/new',
    name: 'NewPost',
    component: PostForm,
    meta: { requiresAuth: true }, // Requires authentication
  },
  {
    path: '/post/edit/:id',
    name: 'EditPost',
    component: PostForm,
    props: true,
    meta: { requiresAuth: true }, // Requires authentication
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); 
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if the route requires authentication
    next({ name: 'Login', query: { redirect: to.fullPath } }); 
  } else {
    next(); 
  }
});

export default router;
