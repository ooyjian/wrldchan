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
    const sel = val.substring(start, finish);
    var newText = sel;
    // do something with the selected content
    switch(buttonType) {
        case "bold":
            newText = val.substring(0, start) + "**" + sel + "**" + val.substring(finish, val.length);
            break;
        case "italics":
            newText = val.substring(0, start) + "*" + sel + "*" + val.substring(finish, val.length);
            break;
        case "header-2":
            newText = val.substring(0, start) + "##" + sel + val.substring(finish, val.length);
            break;
        case "header-3":
            newText = val.substring(0, start) + "###" + sel + val.substring(finish, val.length);
            break;
    }
    txtarea.value = newText;
    return ;
}