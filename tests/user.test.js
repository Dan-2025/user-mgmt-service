// Import modules for testing
const request = require('supertest'); // To make HTTP requests in tests
const app = require('../src/app');    // The express app to be tested
const mongoose = require('mongoose'); // Mongoose for MongoDB interactions
const User = require('../src/models/userModel'); // User model for db interaction

// Setup and teardown for the test suite

// Before all tests, establish a connection to the MongoDB database
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,    // Use the new MongoDB URI parser
        useUnifiedTopology: true, // Use the new unified topology engine
    });
});

// After all tests are finished, clean up the database and close the connection
afterAll(async () => {
    await User.deleteMany({}); // Remove all users from User collection
    await mongoose.connection.close(); // Close the database connection
});

// Test suite for the User service
describe('User Service', () => {

    // Test case for user registration
    it('should register a new user', async () => {
        // Send a POST request to the /users/register endpoint
        const response = await request(app)
            .post('/users/register')  // Endpoint to register a user
            .send({
                username: 'testuser',      // Test username
                email: 'test@example.com', // Test email
                password: 'password123',   // Test password
            });

        // Assert the response status and message to ensure successful user registration
        expect(response.statusCode).toBe(201); // Check status code is 201 (Created)
        expect(response.body.message).toBe('User created successfully'); // Check resp msg
    });

    // Test case for user login
    it('should login an existing user', async () => {
        // First, register a new user
        await request(app)
            .post('/users/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            });

        // Then, attempt to log in with the registered credentials
        const response = await request(app)
            .post('/users/login')  // Endpoint to log in a user
            .send({
                email: 'test@example.com',  // Test email used for login
                password: 'password123',    // Test password used for login
            });

        // Assert the response status and the presence of a JWT token
        expect(response.statusCode).toBe(200);  // Check status code is 200 (OK)
        expect(response.body.token).toBeDefined();  // Check JWT token is present
    });
});