const express = require('express')

const app = express()

app.get('', (req, res) => {
    res.send('<h1>Cocksucka</h1>')
})

app.listen(5000, () => console.log("App Running on Port 5000"))