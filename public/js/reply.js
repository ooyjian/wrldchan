function reply(input_id) {
    var texta = document.getElementById("replyArea-" + input_id)
    if (texta.style.display === "none") {
        texta.style.display = "block"
    } else {
        texta.style.display = "none"
    }
}

function op_reply() {
    var texta = document.getElementById("op-reply")
    if (texta.style.display == "none") {
        texta.style.display = "block"
    } else {
        texta.style.display = "none"
    }
}

function input_func(texta) {
    if (texta.style.display === "none") {
        texta.style.display = "block"
    } else {
        texta.style.display = "none"
    }
}