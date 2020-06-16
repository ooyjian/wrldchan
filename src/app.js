const express = require('express')
const path = require('path')
const hbs = require('hbs')
var bodyParser = require('body-parser');
const mongoose = require('mongoose')

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
    res.send(req.body)
})

app.get('', (req, res) => {
    res.render('index')
})

app.get('/coms', (req, res) => {
    res.render('coms')
})

app.listen(5000, () => console.log("App Running on Port 5000"))