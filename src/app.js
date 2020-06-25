const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser');
const { rawListeners } = require('process');
const {ObjectId} = require('mongodb');

require('./db/mongoose')

const { Reply } = require('./models/reply')

const addReply = require('./helpers/reply');
const mongoose = require('mongoose');
const Post = require('./models/post');

///////////////////////// Start of the actual code ////////////////////////////////////////

const app = express()
const publicDirPath = path.join(__dirname, '../public')
const viewsDirPath = path.join(__dirname, '../templates/views')
const partialsDirPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsDirPath)
app.use(express.static(publicDirPath))
app.use(bodyParser.urlencoded({ extended: true }))
hbs.registerPartials(partialsDirPath)
hbs.registerHelper('addReply', addReply)


/////////////////////// Post Request Below //////////////////////////////////////////////

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
})

app.post('', (req, res) => {
    const newReply = new Reply({
        description: req.body.userInput
    })

    newReply.save().then(() => {
        console.log("Reply saved!")
    }).catch((error) => {
        console.log(error)
    })
    return res.redirect('/replies')
})

app.post("/deleteallreplies", (req, res) => {
    Reply.deleteMany({}).then(() => {
        console.log("Successfully deleted all replies")
    }).catch(() => {
        console.log("Unable to delete all replies")
    })
    return res.redirect('/replies')
})

app.post("/deletereply/:id", (req, res) => {
    const id = ObjectId(req.params.id)
    Reply.deleteOne({ _id: id }).then((result) => {
        console.log("Successfully delete this reply")
    }).catch((error) => {
        console.log("Unable to delete reply")
    })
    return res.redirect('/replies')
})

app.post("/replyreply/:id", (req, res) => {
    Reply.findById(req.params.id).then((result) => {
        const newReply = new Reply({
            description: req.body.replyArea, 
            parent_id: ObjectId(req.params.id),
            post_id: result.post_id
        })
        
        newReply.save().then((result) => {
            // console.log(result.description)
        }).catch((error) => {
            console.log("Unable to save reply")
            console.log(error)
        })
        return res.redirect('back')
    })
})

app.post('/submitpost', (req, res) => {
    const board = req.query.b
    const title = req.body.posttitle
    const content = req.body.postcontent
    
    const newPost = new Post({
        title,
        content, 
        board
    })
    
    newPost.save().then((result) => {
        console.log(result)
        console.log("Post added successfully")
    }).catch((error) => {
        console.log(error);
        console.log("Unable to add post")
    })

    res.redirect('/b/' + board + "/" + newPost._id)

})

app.post('/b/random/:id', (req, res) => {
    const post_id = req.params.id

    const newReply = new Reply({
        description: req.body.userInput,
        post_id
    })

    newReply.save().then(() => {
        console.log("Reply saved!")
    }).catch((error) => {
        console.log("Unable to save reply")
    })
    return res.redirect('back')
})

//////////////////////////// GET Request Below /////////////////////////////////////

app.get('', (req, res) => {
    res.render('index', {
        title: "WRLD"
    })
})

// app.get('/coms', (req, res) => {
//     res.render('coms')
// })

app.get('/b/random', (req, res) => {

    Post.find({ board: 'random' , pin: false}).then((result) => {
        const unpin_posts = result

        Post.find({ board: 'random' , pin: true }).then((result) => {
            res.render('board', {
                title: "/random",
                board: "random",
                pin: result,
                unpin: unpin_posts
            })
        })
   
    }).catch((error) => {
        console.log(error)
        console.log("Unable to load page")
    })
    
})

app.get('/b/random/:id', (req, res) => {
    const post_id = req.params.id
    const post = Post.findById(post_id).then((result) => {
        console.log("Found a post")

        const post_result = result;


        Reply.find({ post_id }).then((result) => {
            res.render('loadpost', {
                title: post_result.title, 
                content: post_result.content, 
                reply: result,
                post_id
            })
        }).catch((error) => {
            console.log(error)
            console.log("Unable to load post " + post_id)
        })

    }).catch((error) => {
        console.log(error)
        console.log("Unable to find post")
    }) 

    

})

app.get("/submitpost", (req, res) => {
    const board = req.query.b
    res.render('submitpost', {
        board
    })
})

// app.get('/replies', (req, res) => {
//     Reply.find({time: {$gte: new Date().getTime()-86400000}}).then((result) => {        
//         res.render('replies', {
//             title: "Replies", 
//             reply: result
//         })
//     }).catch((error) => {
//         console.log(error)
//     })
// })

app.listen(5000, () => console.log("Connected to wrldchan.org!"))