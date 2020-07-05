require('./db/mongoose')

const Post = require('./models/post');
const Reply = require('./models/reply');

const yargs = require('yargs');
const mongoose = require('mongoose')


async function deletePost(post_id) {
    try {
        const result = await Post.deleteOne({ _id: post_id });
        const reply_result = await Reply.deleteMany({ post_id })
        mongoose.connection.close(() => {
            console.log(result);
            console.log(reply_result);
        })
    }    
    catch (e) {
            console.log("==============================================");
            console.log(e);
            console.log("Unable to delete post.");
    }
}

async function deleteReply(reply_id) {
    try {
        const result = await Reply.findByIdAndUpdate({ _id: reply_id }, { description: "[DELETED BY ADMIN]" });
        mongoose.connection.close(() => {
            console.log(result);
        })
    }    
    catch (e) {
            console.log("==============================================");
            console.log(e);
            console.log("Unable to delete reply.");
    }
}


yargs.command({
    command: 'dpost', 
    describe: "Delete a post with the corresponding post id", 
    builder: {
        id: {
            describe: "Post id", 
            demandOption: true
        }
    },
    handler: async (argv) => {
        await deletePost(argv.id);
    }
})

yargs.command({
    command: 'dreply', 
    describe: "Delete a reply with the corresponding reply id", 
    builder: {
        id: {
            describe: "Reply id", 
            demandOption: true
        }
    },
    handler: async (argv) => {
        await deleteReply(argv.id);
    }
})

console.log(yargs.argv)