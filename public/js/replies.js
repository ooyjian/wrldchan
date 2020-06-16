function addReply(replies) {
    
    console.log(replies)
    replies = replies.split(",");
    console.log(replies)
    console.log(replies.length)

    for (var i = 0; i < replies.length; i++) {
        console.log(replies[i]);
        const div = document.createElement('div');
        div.className = "reply-box";
        div.innerHTML = "<p>"+replies[i]+"<p>";
        document.getElementById('main-content').appendChild(div);
    }
}


const replies = document.currentScript.getAttribute('replies');
addReply(replies);