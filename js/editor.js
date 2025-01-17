function insertAtCursor(myField, myValue) {
    if (document.selection) { // IE SUPPORT
        myField.focus();
        const sel = document.selection.createRange();
        sel.text = myValue;
    } else if (myField.selectionStart) { // MOZILLA AND OTHERS
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
        myField.selectionEnd = endPos + 4;
    } else {
        myField.value += myValue;
    }
}

function isRemovingTab(field) {
    if (document.selection) {
        return false;
    }

    if (field.selectionStart < field.selectionEnd) {
        return false;
    }

    if (field.selectionStart) {
        const endPos = field.selectionEnd;
        return field.value.substring(endPos - 4, endPos) === "    ";
    }

    return field.value.substring(field.value.length - 4) === "    ";
}

function removeTab(field) {
    if (document.selection) {
        field.focus();
        const sel = document.selection.createRange();
        sel.text = "";
    }
    else if (field.selectionStart || field.selectionStart === "0") {
        const startPos = field.selectionStart;
        const endPos = field.selectionEnd;

        field.value = field.value.substring(0, startPos - 4)
            + field.value.substring(endPos, field.value.length);
        field.selectionEnd = endPos - 4;
    } else {
        field.value = field.value.substring(0, field.value.length - 4);
    }

    return false;
}

let code;

document.addEventListener("DOMContentLoaded", () => {
    code = document.querySelector("#code");

    code.addEventListener("keypress", e => {
        if (e.key === "Enter" && e.ctrlKey) {
            runit();
        }
    });

    code.addEventListener("keydown", e => {
        if (e.key === "Tab") {
            e.preventDefault();

            insertAtCursor(code, "    ");
        }

        else if (e.key === "Backspace") {
            if (!isRemovingTab(code)) {
                return;
            }

            e.preventDefault();
            removeTab(code);
        }
    });
});