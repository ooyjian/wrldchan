function setSel(textAreaID, buttonType) {
    // obtain the object reference for the <textarea>
    var txtarea = document.getElementById(textAreaID);
    // obtain the index of the first selected character
    var start = txtarea.selectionStart;
    // obtain the index of the last selected character
    var finish = txtarea.selectionEnd;
    // obtain text value in textarea
    var val = txtarea.value;
    // obtain the selected text
    const sel = val.substring(start, finish);
    var newText = sel;
    
    // change textarea depending on the button and selected text
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
        case "link":
            if (sel.length === 0) {
                newText = val.substring(0, start) + "[Put Link Name Here](Paste URL Here)" + val.substring(finish, val.length);
            } else {
                if (sel.substring(0, 4) === "http" || sel.substring(0, 5) === "https") {
                    newText = val.substring(0, start) + "[Put Link Name Here]" + "(" + sel + ")" + val.substring(finish, val.length);
                }
                newText = val.substring(0, start) + "["+ sel + "](Paste URL Here)" + val.substring(finish, val.length);
            }
            break;         
    }
    txtarea.value = newText;
    return ;
}