const mongoose = require('mongoose')

const Reply = new mongoose.model('Reply', {
    description: {
        type: String, 
        required: true, 
        trim: false
    }, 
    time: {
        type: Number,
        default: new Date().getTime()
    }
})

module.exports = Reply