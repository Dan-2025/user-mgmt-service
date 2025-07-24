// Import required modules
const express = require('express'); // Express framework for handling HTTP requests
const connectDB = require('./config/db'); // Function to connect to MongoDB
const userRoutes = require('./routes/userRoutes'); // User-related routes
const dotenv = require('dotenv'); // Load environment variables from .env file

// Load environment variables from .env file
dotenv.config();

// Create an instance of an express application
const app = express();

// Middleware to parse incoming JSON requests
// and make the parsed data available as req.body
app.use(express.json());

// Establish a connection to the MongoDB database
connectDB();

// Use the user routes for any requests that begin with '/users'
// This tells express to route requests for '/users' to the `userRoutes` file
app.use('/users', userRoutes);

// Export the app instance for use in other parts of the application
module.exports = app;