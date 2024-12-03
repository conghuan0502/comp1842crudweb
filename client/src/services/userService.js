import api from '../plugin/axios'; // Axios instance

const userService = {
  register(userData) {
    return api.post('/users/register', userData); // Create new user
  },
  login(credentials) {
    return api.post('/users/login', credentials); // Authenticate user
  },
  getProfile() {
    return api.get('/users/profile'); // Get user's profile (auth required)
  },
  updateProfile(profileData) {
    return api.put('/users/profile', profileData); // Update user profile (auth required)
  },
};

export default userService;
