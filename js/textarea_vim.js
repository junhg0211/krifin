const NORMAL = "NORMAL";
const INSERT = "INSERT";

const normalCommands = [
    {command: "0", callback: (v) => moveCaret(v.target, -Infinity, 0)},
    {command: "^", callback: (v) => moveHome(v.target)},
    {command: "h", callback: (v) => moveCaret(v.target, -1, 0)},
    {command: "j", callback: (v) => moveCaret(v.target, 0, 1)},
    {command: "k", callback: (v) => moveCaret(v.target, 0, -1)},
    {command: "l", callback: (v) => moveCaret(v.target, 1, 0)},
    {command: "$", callback: (v) => moveCaret(v.target, Infinity, 0)},
    {command: "\r", callback: (v) => v.buffer = ""},
    {command: "\n", callback: (v) => v.buffer = ""},
    {command: "\b", callback: (v) => v.buffer = ""},
    {command: "i", callback: (v) => v.setMode(INSERT)},
    {command: "I", callback: (v) => {
        v.simulateVim("^");
        v.simulateVim("i");
    }},
    {command: "a", callback: (v) => {
        v.simulateVim("l");
        v.simulateVim("i");
    }},
    {command: "A", callback: (v) => {
        v.simulateVim("$");
        v.simulateVim("a");
    }},
]

class Vim {
    constructor(target) {
        this.target = target
        this.buffer = "";

        this.mode = NORMAL

        target.addEventListener("keypress", e => {
            if (this.mode !== INSERT) {
                e.preventDefault();
                this.buffer += String.fromCharCode(e.charCode);
            }
    
            if (this.mode === NORMAL) {
                this.flushNormalBuffer();
                return;
            }
        });

        target.addEventListener("keydown", e => {
            if (e.key === "Escape") {
                this.buffer = "";
                this.setMode(NORMAL);
            }
        })
    }

    simulateVim(key) {
        this.buffer += key;
        this.flushNormalBuffer();
    }

    flushNormalBuffer() {
        const tokens = this.buffer.match(/(\d*)(.*)(.|\r|\n)/);

        if (tokens === null) {
            return;
        }

        const repeats = parseInt(tokens[1]) || 1;
        const args = tokens[2];
        const action = tokens[3];

        for (let i = 0; i < normalCommands.length; i++) {
            const normalCommand = normalCommands[i];
            if (normalCommand.command !== action) {
                continue;
            }

            for (let j = 0; j < repeats; j++) {
                normalCommand.callback(this, args);
            }

            this.buffer = "";
            break;
        }
    }

    setMode(mode) {
        this.mode = mode;
    }
}

function getCaretPosition(code) {
    const caretPosition = code.selectionEnd;
    const previousContent = code.value.substring(0, caretPosition);
    const previousLines = previousContent.split(/\n/g);
    const row = previousLines.length;
    const presentLine = previousLines[previousLines.length - 1];
    const col = presentLine.length;

    return [row, col];
}

function setCaretPosition(code, r, c) {
    if (r <= 0) {
        r = 1;
    }
    if (c < 0) {
        c = 0;
    }

    const lines = code.value.split(/\n/g);

    let previousLength = 0;
    if (r > lines.length) {
        previousLength = code.value.length;
    } else {
        for (let i = 0; i < r - 1; i++) {
            previousLength += lines[i].length + 1;
        }
        previousLength += Math.min(lines[r-1].length, c);
    }

    code.selectionStart = previousLength;
    code.selectionEnd = previousLength;

    code.blur();
    code.focus();
}

function moveCaret(code, dx, dy) {
    const [row, col] = getCaretPosition(code);
    setCaretPosition(code, row + dy, col + dx);
}

function moveHome(code) {
    const [row] = getCaretPosition(code);
    const indentation = code.value.split(/\n/g)[row-1].match(/^ */)[0].length;
    setCaretPosition(code, row, indentation);
}