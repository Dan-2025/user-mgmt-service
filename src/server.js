// Import the express application from the 'app.js' file
const app = require('./app');

// Set the port number from env variables or default to 5000 if not set
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests on the specified port
app.listen(PORT, () => {
    // Log a message once the server is running
    console.log(`Server running on port ${PORT}`);
});