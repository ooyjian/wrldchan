const mongoose = require('mongoose');
const Reply = require('./reply');

const postSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    }, content: {
        type: String, 
        required: false
    }, 
    board: {
        type: String, 
        required: true
    }, 
    pin: {
        type: Boolean, 
        default: false
    }, 
    timestamp: {
        type: Number,
        required: true
    }, 
    username: {
        type: String, 
        default: 'Anonymous'
    }
});

const Post = new mongoose.model('Post', postSchema);

module.exports = Post;