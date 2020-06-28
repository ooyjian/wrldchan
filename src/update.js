const express = require('express');

const app = express()

app.get('', (req, res) => {
    res.send("Website Updating...");
})

app.listen(5000, () => console.log("Connected to wrldchan.org!"))