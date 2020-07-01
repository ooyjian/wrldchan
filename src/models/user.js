const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        unique: true,
        required: true
    }, 
    password: {
        type: String, 
        required: true
    }, 
    tokens: [{
        token: {
            type: String, 
            required: true
        }
    }]
});

userSchema.pre('save', async function(next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
})

const User = new mongoose.model('User', userSchema);

module.exports = User