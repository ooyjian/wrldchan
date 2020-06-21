const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const Reply = new mongoose.model('Reply', {
    description: {
        type: String, 
        required: true, 
        trim: false
    }, 
    time: {
        type: Number,
        default: new Date().getTime()
    },
    parent_id: {
        type: ObjectId, 
        default: null
    }
})

module.exports = Reply