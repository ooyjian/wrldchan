const Reply = require("../models/reply")



function addReply(parent_id) {
    if (!parent_id) {
        console.log("No parent")
        return
    }

    Reply.findById(parent_id).then((result) => {
        console.log(result.description)
    }).catch((err) => {
        console.log("Unable to find parent reply")
    })

}

module.exports = addReply