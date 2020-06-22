function addReply(reply, options) {

    var stack = new Array();
    var rest = new Array();
    var prev_id = null;

    for (var i = 0; i < reply.length; i++) {
        if (reply[i].parent_id === prev_id) {
            stack.push(reply[i]);
        } else {
            rest.push(reply[i]);
        }
    }

    var return_html = "";

    while (stack.length != 0) {
        return_html += dfs(stack, rest, options, "reply-box-1");
    }
    
    return return_html;

}

function dfs(stack, rest, options, reply_box) {
    
    var return_html = "";

    if (stack.length === 0) {
        console.log("Stack's empty");
        return return_html;
    }
    
    var parent_reply = stack.pop();
    const prev_id = parent_reply._id;
    return_html += "<div class=\"" + reply_box + "\">\n" + "<p id=\"reply\">" + parent_reply.description + "</p>\n" + options.fn(prev_id.toString()) + "\n";

    for (var i = 0; i < rest.length; i++) {
        if (rest[i].parent_id.toString() === prev_id.toString()) {
            stack.push(rest[i]);
            if (reply_box === "reply-box-1") {
                return_html += dfs(stack, rest.slice(0,i).concat(rest.slice(i+1,)), options, "reply-box-2");
            } else {
                return_html += dfs(stack, rest.slice(0,i).concat(rest.slice(i+1,)), options, "reply-box-1");
            }
        }
    }

    return_html += "</div>\n";

    return return_html;
}



module.exports = addReply;