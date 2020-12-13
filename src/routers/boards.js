const express = require('express');
const Post = require('../models/post');
const Reply = require('../models/reply');

// This is the router for all the boards. 
const router = express.Router();

// Helper Func. Compare which time is earlier. 
function compareByTime(a, b) {
    if (a.timestamp > b.timestamp) return -1;
    if (a.timestamp < b.timestamp) return 1;

    return 0;
}

// Show the posts by their order. (And everything else in the board)
async function showBoard(req, res, board, title) {
    const unpin_posts = await Post.find({ board: board , pin: false})

    unpin_posts.sort(compareByTime)

    const pin_posts = await Post.find({ board: board , pin: true })

    pin_posts.sort(compareByTime)
    
    res.render('board', {
        title: title,
        board: board,
        pin: pin_posts,
        unpin: unpin_posts
    })
}

// Load a single post
async function loadPost(req, res) {
    const post_id = req.params.id
    const post = await Post.findById(post_id)

    const reply = await Reply.find({ post_id })

    res.render('loadpost', {
            title: post.title, 
            content: post.content, 
            time: post.timestamp,
            username: post.username,
            reply,
            post_id
        })
}

async function loadStreamPost(req, res) {
    
}

// Get the first page of the board

router.get('/inep', (req, res) => {

    showBoard(req, res, "inep", "WRLD");
    
})

// Get the post page

router.get('/inep/:id', (req, res) => {

    loadPost(req, res);

});

module.exports = router;