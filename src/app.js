const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser');
const { rawListeners } = require('process');
const {ObjectId} = require('mongodb');

require('./db/mongoose')

const { Reply } = require('./models/reply')

const { addReply, convertDate } = require('./helpers/reply');
const Post = require('./models/post');

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

/////////////////////// Helper functions here ///////////////////////////////////////////

/* This function is used to sort the posts by their timestamp */
function compareByTime(a, b) {
    if (a.timestamp > b.timestamp) return 1;
    if (a.timestamp < b.timestamp) return -1;

    return 0;
}

function showBoard(req, res, board, title, boardImg="") {
    Post.find({ board: board , pin: false}).then((result) => {
        const unpin_posts = result

        unpin_posts.sort(compareByTime)

        Post.find({ board: 'random' , pin: true }).then((result) => {
            res.render('board', {
                title: title,
                board: board,
                pin: result,
                unpin: unpin_posts, 
                boardImg
            })
        })
   
    }).catch((error) => {
        console.log(error)
        console.log("Unable to load page")
    })
}

function loadPost(req, res) {
    const post_id = req.params.id
    Post.findById(post_id).then((result) => {

        const post_result = result;


        Reply.find({ post_id }).then((result) => {
            res.render('loadpost', {
                title: post_result.title, 
                content: post_result.content, 
                time: post_result.timestamp,
                reply: result,
                post_id
            })
        }).catch((error) => {
            console.log(error)
            console.log("Unable to load post " + post_id)
        })

    }).catch((error) => {
        console.log(error)
        console.log("Unable to find post")
    }) 
}

function opReply(req, res) {
    const post_id = req.params.id

    const currentTime = new Date().getTime();

    const newReply = new Reply({
        description: req.body.userInput,
        time: currentTime,
        post_id
    })

    newReply.save().then(() => {
        console.log("Reply saved!")
    }).catch((error) => {
        console.log("Unable to save reply")
    })
    return res.redirect('back')
}

/////////////////////// Post Request Below //////////////////////////////////////////////

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
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

app.post("/replyreply/:id", (req, res) => {

    Reply.findById(req.params.id).then((result) => {  
        const currentTime = new Date().getTime()

        const newReply = new Reply({
            description: req.body.replyArea, 
            time: currentTime,
            parent_id: ObjectId(req.params.id),
            post_id: result.post_id
        })
        
        newReply.save().then((result) => {
            // console.log(result.description)
        }).catch((error) => {
            console.log("Unable to save reply")
            console.log(error)
        })
        return res.redirect('back')
    })
})

app.post('/submitpost', (req, res) => {
    const board = req.query.b
    const title = req.body.posttitle
    const content = req.body.postcontent
    const currentTime = new Date().getTime();

    console.log(req.body)
    
    const newPost = new Post({
        title,
        content, 
        board, 
        timestamp: currentTime
    })
    
    newPost.save().then((result) => {
        console.log(result)
        console.log("Post added successfully")
    }).catch((error) => {
        console.log(error);
        console.log("Unable to add post")
    })

    res.redirect('/b/' + board + "/" + newPost._id)

})

app.post('/b/random/:id', (req, res) => {
    opReply(req, res);
})

app.post('/b/tech/:id', (req, res) => {
    opReply(req, res);
})

app.post('/b/fic/:id', (req, res) => {
    opReply(req, res);
})

app.post('/b/poli/:id', (req, res) => {
    opReply(req, res);
})


//////////////////////////// GET Request Below /////////////////////////////////////

app.get('', (req, res) => {
    res.render('index', {
        title: "WRLD"
    })
})

///////////// The boards ////////////////////////////

app.get('/b/inep', (req, res) => {

    showBoard(req, res, "inep", "Inverted Pen*s", "/img/inepboard.jpg");
    
})

app.get('/b/tech', (req, res) => {

    showBoard(req, res, "tech", "/tech");

})

app.get('/b/fic', (req, res) => {

    showBoard(req, res, "fic", "/fiction");

})

app.get('/b/poli', (req, res) => {

    showBoard(req, res, "poli", "/poli", "/img/brazil1985jill.jpg");

})

app.get('/b/random/:id', (req, res) => {

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