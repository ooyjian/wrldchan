const express = require('express');
const admin = require('../admin.js');
const adminTools = require('../admin.js')
const Post = require('../models/post')
const Reply = require('../models/reply')

const router = express.Router()

router.get('/', async (req, res) => {
    const pin = await Post.find({pin: true})
    const unpin = await Post.find({pin: false})
    res.render('manage', {
        pin: pin,
        unpin: unpin
    })
})

router.post('/dpost/:id', async(req, res) => {
    const id = req.params.id
    adminTools.dpost(id)
    res.redirect('back')
})

router.post('/dreply/:id', async(req, res) => {
    const id = req.params.id
    adminTools.dreply(id)
    res.redirect('back')
})

router.post('/pinpost/:id', async(req, res) => {
    const id = req.params.id
    adminTools.pinpost(id)
    res.redirect('back')
})

router.post('/unpinpost/:id', async(req, res) => {
    const id = req.params.id
    adminTools.unpinpost(id)
    res.redirect('back')
})

module.exports = router