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
    return_html += "<div class=\"" + reply_box + "\">\n"  
                    + "<div id=\"reply-username\" class=\"username\">" + parent_reply.username + "\n"
                    + "<span id=\"reply-id\">" + parent_reply._id + "</span>" + "\n"
                    + "<span class=\"timestamp-reply\">" + convertDate(parent_reply.time) + "</span>" + "</div>"
                    + "<p id=\"reply\">" + parent_reply.description + "</p>\n" 
                    + options.fn(prev_id.toString()) + "\n";

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

function convertDate(timestamp) {
    const currentTime = new Date().getTime();
    const past = currentTime - timestamp;
    var x;
    if (past < 3600000) {
        x = Math.floor(past/60000);
        return x===1 ? x.toString() + " minute" : x.toString() + " minutes";
    } else if (past < 86400000) {
        x = Math.floor(past/3600000);
        return x===1 ? x.toString() + " hour" : x.toString() + " hours";
    } else if (past < 2592000000) {
        x = Math.floor(past/86400000);
        return x===1 ? x.toString() + " day" : x.toString() + " days";
    } else if (past < 31556952000) {
        x = Math.floor(past/2592000000);
        return x===1 ? x.toString() + " month" : x.toString() + " months";
    } else {
        x = Math.floor(path/31556952000);
        return x===1 ? x.toString() + " year" : x.toString() + " years";
    }
}



module.exports = { addReply, convertDate };