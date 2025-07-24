// Import modules and models
const User = require('../models/userModel'); // User model for MongoDB operations
const bcrypt = require('bcryptjs');  // Library for hashing passwords
const jwt = require('jsonwebtoken'); // Library for JSON Web Tokens (JWTs)

// Register a new user
const registerUser = async (req, res) => {
    // Extract username, email, and password from request body
    const { username, email, password } = req.body;

    // Validate input: Ensure either username or email is provided
    if (!username && !email) {
        return res.status(400).json({ message: 'Please provide username or email' });
    }

    try {
        // Check if a user with the given username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password using bcrypt with a salt rounds of 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the provided details
        const newUser = new User({ username, email, password: hashedPassword });

        // Save the new user to the database
        await newUser.save();
        
        // Respond with a success message
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        // If an error occurs, respond with a 500 status and the error message
        res.status(500).json({ error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    // Extract username/email and password from request body
    const { username, email, password } = req.body;

    try {
        // Find a user by username or email
        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token with the user's id and a secret key
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the JWT token
        res.json({ token });
    } catch (error) {
        // If an error occurs, respond with a 500 status and error message
        res.status(500).json({ error: error.message });
    }
};

// Get user information by username
const getUser = async (req, res) => {
    const { username } = req.params;

    try {
        // Find a user by username, excluding the password field
        const user = await User.findOne({ username }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the user data
        res.json(user);
    } catch (error) {
        // If an error occurs, respond with a 500 status and error message
        res.status(500).json({ error: error.message });
    }
};

// Update user information
const updateUser = async (req, res) => {
    try {
        const { username } = req.params; // Extract the username from URL params
        const updates = req.body; // Extract the update fields from the request body

        // Find the user by their username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Apply the updates if they are provided in the request
        if (updates.email) user.email = updates.email;
        if (updates.password) {
            // Hash the new password before saving it
            user.password = await bcrypt.hash(updates.password, 10);
        }
        if (updates.newUsername) user.username = updates.newUsername;

        // Save the updated user information to the database
        await user.save();

        // Respond with a success message and the updated user data
        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        // If an error occurs, respond with a 500 status and error message
        res.status(500).json({ error: err.message });
    }
};

// Delete user by username
const deleteUser = async (req, res) => {
    try {
        const { username } = req.params; // Extract the username from URL params

        // Attempt to find and delete the user by username
        const user = await User.findOneAndDelete({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with a success message
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        // If an error occurs, respond with a 500 status and error message
        res.status(500).json({ error: error.message });
    }
};

// Export all controller functions to be used in routes
module.exports = { registerUser, loginUser, getUser, updateUser, deleteUser };