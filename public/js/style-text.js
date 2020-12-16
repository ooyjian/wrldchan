function setSel(buttonType) {
    // obtain the object reference for the <textarea>
    var txtarea = document.getElementById("postcontent");
    // obtain the index of the first selected character
    var start = txtarea.selectionStart;
    // obtain the index of the last selected character
    var finish = txtarea.selectionEnd;
    // obtain text value in textarea
    var val = txtarea.value;
    // obtain the selected text
    var sel = val.substring(start, finish);
    // do something with the selected content
    switch(buttonType) {
        case "bold":
            var newText = val.substring(0, start) + "**" + sel + "**" + val.substring(finish, val.length);
            break;
        case "italics":
            var newText = val.substring(0, start) + "*" + sel + "*" + val.substring(finish, val.length);
            break;
        case "header-2":
            var newText = val.substring(0, start) + "##" + sel + "##" + val.substring(finish, val.length);
            break;
        case "header-3":
            var newText = val.substring(0, start) + "###" + sel + "###" + val.substring(finish, val.length);
            break;
    }
    return sel;
}