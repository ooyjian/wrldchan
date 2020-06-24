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
    const newReply = new Reply({
        description: req.body.replyArea, 
        parent_id: ObjectId(req.params.id)
    })
    
    newReply.save().then((result) => {
        // console.log(result.description)
    }).catch((error) => {
        console.log("Unable to save reply")
        console.log(error)
    })
    return res.redirect('/replies')
})

app.post('/submitpost', (req, res) => {
    const board = req.query.b
    const title = req.body.posttitle
    const content = req.body.postcontent
    
    const newPostRandom = new Post({
        title,
        content, 
        board
    })
    
    newPostRandom.save().then((result) => {
        console.log(result)
        console.log("Post added successfully")
    }).catch((error) => {
        console.log(error);
        console.log("Unable to add post")
    })

    res.redirect('/b/' + board)

})

//////////////////////////// GET Request Below /////////////////////////////////////

app.get('', (req, res) => {
    res.render('index', {
        title: "wrldchan"
    })
})

app.get('/coms', (req, res) => {
    res.render('coms')
})

app.get('/b/random', (req, res) => {

    Post.find({ board: 'random' }).then((result) => {
        res.render('random', {
            title: "/random",
            posts: result
        })
    }).catch((error) => {
        console.log(error)
        console.log("Unable to load page")
    })
    
})

app.get("/submitpost", (req, res) => {
    const board = req.query.b
    res.render('submitpost', {
        board
    })
})

app.get('/replies', (req, res) => {
    Reply.find({time: {$gte: new Date().getTime()-86400000}}).then((result) => {        
        res.render('replies', {
            title: "Replies", 
            reply: result
        })
    }).catch((error) => {
        console.log(error)
    })
})

app.listen(5000, () => console.log("Connected to wrldchan.org!"))