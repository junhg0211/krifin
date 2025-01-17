function insertAtCursor(myField, myValue) {
    if (myField.selectionStart) { // MOZILLA AND OTHERS
        const startPos = myField.selectionStart;
        const endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
        myField.selectionEnd = endPos + 4;
        return;
    }

    myField.value += myValue;
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
    if (field.selectionStart || field.selectionStart === "0") {
        const startPos = field.selectionStart;
        const endPos = field.selectionEnd;

        field.value = field.value.substring(0, startPos - 4)
            + field.value.substring(endPos);
        field.selectionEnd = endPos - 4;
        return;
    }

    field.value = field.value.substring(0, field.value.length - 4);
}

function updateLineNumber(code, lineNumber) {
    lineNumber.value = "";

    const startPos = code.selectionStart;
    const endPos = code.selectionEnd;

    const startLbs = (code.value.substring(0, startPos).match(/\n/g) || []).length;
    const middleLbs = (code.value.substring(startPos, endPos).match(/\n/g) || []).length;
    const endLbs = (code.value.substring(endPos).match(/\n/g) || []).length;

    // -- update line number
    for (let i = 1; i <= startLbs; i++) {
        lineNumber.value += ` ${startLbs - i + 1}\n`;
    }

    if (middleLbs === 0) {
        lineNumber.value += `${startLbs + 1}\n`;
    } else {
        for (let i = 0; i <= middleLbs; i++) {
            lineNumber.value += `${startLbs + 1 + i}\n`;
        }
    }

    for (let i = 1; i <= endLbs; i++) {
        lineNumber.value += ` ${i}\n`;
    }

    lineNumber.value = lineNumber.value.substring(0, lineNumber.value.length - 1);

    // -- update scroll
    lineNumber.scrollTo(0, code.scrollTop);
}

let code;
let lineNumber;

document.addEventListener("DOMContentLoaded", () => {
    code = document.querySelector("#code");
    lineNumber = document.querySelector("#line-number");
    stdout = document.querySelector("#stdout");

    code.addEventListener("keypress", e => {
        if (e.key === "Enter" && e.ctrlKey) {
            runit();
        }

        updateLineNumber(code, lineNumber);
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

        updateLineNumber(code, lineNumber);
    });

    code.addEventListener('keyup', () => {
        updateLineNumber(code, lineNumber);
    })

    code.addEventListener('mousedown', () => {
        updateLineNumber(code, lineNumber);
    })

    code.addEventListener('mouseup', () => {
        updateLineNumber(code, lineNumber);
    })

    code.addEventListener('scroll', () => {
        updateLineNumber(code, lineNumber);
    })

    const platform = window.navigator.platform;
    if (platform.substring(0, 3) === "Mac") {
        stdout.placeholder = "Command + Enter to run";
    }
});