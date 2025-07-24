// Import express to create routes for the user service
const express = require('express');

// Import the user controller functions to handle the requests
const { registerUser, loginUser, getUser, updateUser, deleteUser } = require('../controllers/userController');

// Initialize an instance of the express router
const router = express.Router();

// Define the route to register a new user
// This route listens for POST requests at '/register' and calls registerUser()
router.post('/register', registerUser);

// Define the route for user login
// This route listens for POST requests at '/login' and calls loginUser()
router.post('/login', loginUser);

// Define the route to get a user by username
// This route listens for GET requests at '/:username' and calls getUser()
router.get('/:username', getUser);

// Define the route to update a user's details
// This route listens for PUT requests at '/:username' and calls updateUser())
router.put('/:username', updateUser);

// Define the route to delete a user by username
// This route listens for DELETE requests at '/:username' and calls deleteUser())
router.delete('/:username', deleteUser);

// Export the router to be used in other parts of the application
module.exports = router;