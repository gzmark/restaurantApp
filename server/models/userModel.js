const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minlength: 8,
        maxlength: 128,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;