// Import mongoose to define a MongoDB schema and interact with the database
const mongoose = require('mongoose');

// Define the schema for the 'User' model
const userSchema = new mongoose.Schema({
    // 'username' is a unique field and can have null values (sparse)
    username: { type: String, unique: true, sparse: true },

    // 'email' is a unique field and can have null values (sparse)
    email: { type: String, unique: true, sparse: true },

    // 'password' is a required field for each user
    password: { type: String, required: true },
}, { timestamps: true }); // Automatic creation of 'createdAt' and 'updatedAt' fields

// Custom validation hook that runs before the document is validated
userSchema.pre('validate', function(next) {
    // If both 'username' and 'email' are not provided, invalidate the document
    if (!this.username && !this.email) {
        this.invalidate('username', 'Either username or email is required');
        this.invalidate('email', 'Either email or username is required');
    }
    // Proceed with validation
    next();
});

// Create a Mongoose model named 'User' based on the userSchema
const User = mongoose.model('User', userSchema);

// Export the User model to be used in other parts of the application
module.exports = User;