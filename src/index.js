const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const { rawListeners } = require('process')
const {ObjectId} = require('mongodb')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('./db/mongoose')

const User = require('./models/user')

const { addReply, convertDate } = require('./helpers/reply')

const boards = require('./routers/boards')

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

async function opReply(req, res) {
    const post_id = req.params.id

    const currentTime = new Date().getTime();

    const newReply = new Reply({
        description: req.body.userInput,
        time: currentTime,
        post_id
    })

    await newReply.save()

    return res.redirect('back')
}

/////////////////////// Post Request Below //////////////////////////////////////////////

app.post('/login', async (req, res) => {
    try {
        const username = req.body.loginusername
        const password = req.body.loginpassword

        const exist_account = await User.findOne({ username })

        if (!exist_account) {
            console.log("Username does not exist")
            return res.redirect('back')
        } else if (!bcrypt(exist_account.password, password)) {
            console.log("Password incorrect")
            return res.redirect('back')
        }

        return res.redirect('/')
    } catch (e) {
        res.status(400).send()
    }
})

app.post("/createaccount", async (req, res) => {
    try {
        const username = req.body.createusername
        const password = req.body.createpassword
        
        await new User({
            username, 
            password
        }).save()

        return res.redirect('/')
    } catch (e) {
        res.status(400).send()
    }
    
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

app.post("/replyreply/:id", async (req, res) => {

    const reply = await Reply.findById(req.params.id)
    
    const currentTime = new Date().getTime()

    const newReply = new Reply({
        description: req.body.replyArea, 
        time: currentTime,
        parent_id: ObjectId(req.params.id),
        post_id: reply.post_id
    })
        
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
    
    await newPost.save()

    res.redirect('/b/' + board + "/" + newPost._id)

})

app.post('/p/:id', (req, res) => {
    opReply(req, res);
})

//////////////////////////// GET Request Below /////////////////////////////////////

app.get('', (req, res) => {
    console.log(req.headers)
    console.log(req.headers['x-forwarded-for'])
    console.log(req.connection.remoteAddress)

    res.render('index', {
        title: "WRLD"
    })
})

app.get('/login', async (req, res) => {
    res.render('login')
})

app.get('/b/inep', (req, res) => {

    showBoard(req, res, "inep", "INVERTED PEN*S");
    
})

app.get('/b/tech', (req, res) => {

    showBoard(req, res, "tech", "/tech");

})

app.get('/b/fic', (req, res) => {

    showBoard(req, res, "fic", "/fiction");

})

app.get('/b/poli', (req, res) => {

    showBoard(req, res, "poli", "/poli");

})

app.get('/b/inep/:id', (req, res) => {

    loadPost(req, res);

})

app.get('/b/tech/:id', (req, res) => {
    
    loadPost(req, res);

})

app.get('/b/fic/:id', (req, res) => {
    
    loadPost(req, res);

})

app.get('/b/poli/:id', (req, res) => {
    
    loadPost(req, res);

})

app.get("/submitpost", (req, res) => {
    const board = req.query.b
    res.render('submitpost', {
        board
    })
})

app.listen(5000, () => console.log("Connected to wrldchan.org!"))
