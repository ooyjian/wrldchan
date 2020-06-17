function addReply(replies) {
    
    console.log(replies)
    replies = replies.split(",");

    for (var i = 0; i < replies.length; i++) {
        console.log(replies[i]);
        const div = document.createElement('div');
        div.id = "reply-box";
        div.innerHTML = "<p>"+replies[i]+"<p>";
        document.getElementById('reply-content').appendChild(div);
    }
}


const replies = document.currentScript.getAttribute('replies');
console.log(replies)
addReply(replies);