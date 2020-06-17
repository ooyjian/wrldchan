const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser');
const { rawListeners } = require('process');

require('./db/mongoose')

const Reply = require('./models/reply')

const app = express()
const publicDirPath = path.join(__dirname, '../public')
const viewsDirPath = path.join(__dirname, '../templates/views')
const partialsDirPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsDirPath)
app.use(express.static(publicDirPath))
app.use(bodyParser.urlencoded({ extended: true })); 
hbs.registerPartials(partialsDirPath)


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
    const _timestamp = req.params.id
    Reply.deleteOne({ time: _timestamp }).then((result) => {
        console.log("Successfully delete this reply")
    }).catch((error) => {
        console.log("Unable to delete reply")
    })
    return res.redirect('/replies')
})

app.get('', (req, res) => {
    res.render('index', {
        title: "( ͡◉ ͜ʖ ͡◉)"
    })
})

app.get('/coms', (req, res) => {
    res.render('coms')
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