function reply(input_id) {
    var texta = document.getElementById("replyArea-" + input_id)
    if (texta.style.display === "none") {
        texta.style.display = "block"
    } else {
        texta.style.display = "none"
    }
}