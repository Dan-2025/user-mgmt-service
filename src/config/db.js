// Import required libraries
const mongoose = require('mongoose'); // To connect and interact with MongoDB
const dotenv = require('dotenv');     // To load env variables from .env file

// Load environment variables from .env file into process.env
dotenv.config();

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,    // Use the new MongoDB URL parser
            useUnifiedTopology: true, // Use the new unified topology engine
        });

        // If successful, log a success message to the console
        console.log('MongoDB connected');
    } catch (error) {
        // If the connection fails, log an error message and terminate the process
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit the process with code 1 (indicating failure)
    }
};

// Export the connectDB function for other parts of the application
module.exports = connectDB;