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
        required: true
    },
    parent_id: {
        type: ObjectId, 
        default: null
    }, 
    post_id: {
        type: ObjectId, 
        default: null
    }, 
    ip: {
        type: String
    }
})

const Reply = new mongoose.model('Reply', replySchema)

module.exports = {Reply: Reply, replySchema: replySchema}