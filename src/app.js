const express = require('express')
const path = require('path')
const hbs = require('hbs')

const app = express()
const publicDirPath = path.join(__dirname, '../public')
const viewsDirPath = path.join(__dirname, '../templates/views')
const partialsDirPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsDirPath)
app.use(express.static(publicDirPath))
hbs.registerPartials(partialsDirPath)

app.get('', (req, res) => {
    res.render('index')
})

app.listen(5000, () => console.log("App Running on Port 5000"))