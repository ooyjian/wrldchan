const mongoose = require('mongoose')

const Reply = new mongoose.model('Reply', {
    description: {
        type: String, 
        required: true
    }, 
    time: {
        type: Number,
        default: new Date().getTime()
    }
})

module.exports = Reply