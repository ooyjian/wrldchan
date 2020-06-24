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
    }
});

const Post = new mongoose.model('Post', postSchema);

module.exports = Post;