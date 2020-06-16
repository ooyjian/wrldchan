const express = require('express')
const path = require('path')
const hbs = require('hbs')
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { rawListeners } = require('process');

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
    res.render('replies', {
        title: "Replies", 
        reply
    })
})

app.listen(5000, () => console.log("App Running on Port 5000"))