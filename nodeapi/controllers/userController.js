// controllers/userController.js
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
  // Register new user
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User({
        username,
        email,
        password: hashedPassword
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      res.status(201).json({
        message: 'User created successfully',
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          karma: user.karma
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          karma: user.karma
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  }

  async getProfile(req, res) {
    try {
        // Example logic to retrieve user profile
        const userId = req.user.userId; // Assuming `auth` middleware sets `req.user`
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
        const userId = req.user.userId; // Assuming `auth` middleware sets `req.user`
        const { username, email } = req.body;

        // Update user details
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true } // Return the updated user
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  }
}
module.exports = UserController;