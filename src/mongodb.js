const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const connectURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log("Unable to connect to database")
    }

    const db = client.db(databaseName)

    db.collection('users').insertOne({
        name: 'Michael', 
        age: 389032
    })
})