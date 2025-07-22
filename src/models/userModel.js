const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // sparse (instead of required) allows unique + null values
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
}, { timestamps: true });

// Custom validator: require either username or email
userSchema.pre('validate', function(next) {
    if (!this.username && !this.email) {
        this.invalidate('username', 'Either username or email is required');
        this.invalidate('email', 'Either email or username is required');
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;