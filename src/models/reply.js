const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId } = require('mongodb')

const replySchema = new Schema({
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

module.exports = {Reply: Reply, replySchema: replySchema}