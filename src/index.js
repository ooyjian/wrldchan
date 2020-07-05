const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const { rawListeners } = require('process')
const {ObjectId} = require('mongodb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const seedrandom = require('seedrandom')

require('./db/mongoose')

const Post = require('./models/post')
const Reply = require('./models/reply')
const User = require('./models/user')

const { addReply, convertDate } = require('./helpers/reply')
const { findNameAdj, adjlen } = require('./usernames/name-adj')
const { findNameNoun, nounlen } = require('./usernames/name-noun')

const boards = require('./routers/boards')
const { post } = require('./routers/boards')
const { resolveSoa } = require('dns')

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
hbs.registerHelper('convertDate', convertDate)

app.use('/b', boards)

/////////////////////// Helper functions here ///////////////////////////////////////////

async function getRandomName(name) {
    const seed = seedrandom(name, { global: true });
    const ind1 = Math.floor((Math.random() * 10000)) % adjlen;
    const ind2 = Math.floor((Math.random() * 10000)) % nounlen;
    
    return findNameAdj(ind1) + " " + findNameNoun(ind2);
}

async function opReply(req, res) {
    const post_id = req.params.id

    const currentTime = new Date().getTime();

    const newReply = new Reply({
        description: req.body.userInput,
        time: currentTime,
        post_id
    })

    try {
        const username = await getRandomName(req.headers['x-forwarded-for'] + post_id.toString())
        newReply.username = username  
    } catch (e) {
        console.log("Unable to generate username")
    }

    await newReply.save()

    return res.redirect('back')
}

/////////////////////// Post Request Below //////////////////////////////////////////////

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

app.post("/replyreply/:id", async (req, res) => {

    const reply = await Reply.findById(req.params.id)
    
    const currentTime = new Date().getTime()

    const newReply = new Reply({
        description: req.body.replyArea, 
        time: currentTime,
        parent_id: ObjectId(req.params.id),
        post_id: reply.post_id
    })

    try {
        const username = await getRandomName(req.headers['x-forwarded-for'] + reply.post_id.toString())
        newReply.username = username    
    } catch (e) {
        console.log("Unable to generate username")
    }

    await newReply.save()

    return res.redirect('back')
})

app.post('/submitpost', async (req, res) => {
    const board = req.query.b
    const title = req.body.posttitle
    const content = req.body.postcontent
    const currentTime = new Date().getTime();
    
    const newPost = new Post({
        title,
        content, 
        board, 
        timestamp: currentTime
    })

    try {
        const username = await getRandomName(req.headers['x-forwarded-for'] + newPost._id.toString())
        newPost.username = username  
    } catch (e) {
        console.log("Unable to generate username")
    }

    await newPost.save()

    res.redirect('/b/' + board + "/" + newPost._id)

})

app.post('/repost/:id', async (req, res) => {
    const post_id = req.params.id;

    const currentTime = new Date().getTime();

    const newPost = await Post.findOneAndUpdate({_id: post_id}, {timestamp: currentTime})

    return res.redirect('back');
})

app.post('/p/:id', (req, res) => {
    opReply(req, res);
})

//////////////////////////// GET Request Below /////////////////////////////////////

app.get('', (req, res) => {
    res.render('index', {
        title: "WRLD"
    })
})

app.get('/login', async (req, res) => {
    res.render('login')
})

app.get("/submitpost", (req, res) => {
    const board = req.query.b
    res.render('submitpost', {
        board
    })
})

app.listen(5000, () => console.log("Connected to wrldchan.org!"))
