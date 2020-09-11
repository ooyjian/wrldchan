const express = require('express');
const Post = require('../models/post');
const Reply = require('../models/reply');


const router = express.Router();


function compareByTime(a, b) {
    if (a.timestamp > b.timestamp) return -1;
    if (a.timestamp < b.timestamp) return 1;

    return 0;
}

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



router.get('/inep', (req, res) => {

    showBoard(req, res, "inep", "WRLD");
    
})

// router.get('/tech', (req, res) => {

//     showBoard(req, res, "tech", "/tech");

// })

// router.get('/fic', (req, res) => {

//     showBoard(req, res, "fic", "/fiction");

// })

// router.get('/poli', (req, res) => {

//     showBoard(req, res, "poli", "/poli");

// })

router.get('/inep/:id', (req, res) => {

    loadPost(req, res);

})

// router.get('/tech/:id', (req, res) => {
    
//     loadPost(req, res);

// })

// router.get('/fic/:id', (req, res) => {
    
//     loadPost(req, res);

// })

// router.get('/poli/:id', (req, res) => {
    
//     loadPost(req, res);

// })

module.exports = router;