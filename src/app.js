const express = require('express')
const path = require('path')
const hbs = require('hbs')
var bodyParser = require('body-parser');
const { rawListeners } = require('process');
const Reply = require('./models/reply')

require('./db/mongoose')

const app = express()
const publicDirPath = path.join(__dirname, '../public')
const viewsDirPath = path.join(__dirname, '../templates/views')
const partialsDirPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsDirPath)
app.use(express.static(publicDirPath))
app.use(bodyParser.urlencoded({ extended: true })); 
hbs.registerPartials(partialsDirPath)

var reply = ''

app.post('', (req, res) => {
    reply = req.body.userInput
    const newReply = new Reply({
        description: req.body.userInput
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
    const reply = Reply.find({}).map((x) => {
        console.log(x.description)
        x = x.description
    })
    res.render('replies', {
        title: "Replies", 
        reply: Reply.find({})
    })
})

app.listen(5000, () => console.log("Connected to wrldchan.org!"))