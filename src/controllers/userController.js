const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username && !email) {
        return res.status(400).json({ message: 'Please provide username or email' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user
const getUser = async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await User.findOne({ username }).select('-password'); // exclude password
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
      const { username } = req.params;
      const updates = req.body;
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Apply only provided updates
      if (updates.email) user.email = updates.email;
      if (updates.password) {
        const bcrypt = require('bcryptjs');
        user.password = await bcrypt.hash(updates.password, 10);
      }
      if (updates.newUsername) user.username = updates.newUsername;
  
      await user.save();
      res.json({ message: 'User updated successfully', user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
      const { username } = req.params;
  
      const user = await User.findOneAndDelete({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
module.exports = { registerUser, loginUser, getUser, updateUser, deleteUser };