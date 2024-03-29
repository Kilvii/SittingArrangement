function setBorder(element) {
    if (element.value.trim() !== '') {
        element.style.border = '2px solid green'; 
    } else {
        element.style.border = '1px solid #dddddd'; 
    }
}