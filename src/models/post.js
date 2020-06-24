const mongoose = require('mongoose');
const Reply = require('./reply');

const Post = new mongoose.Schema('postSchema', {
    title: {
        type: String, 
        required: true
    }
})