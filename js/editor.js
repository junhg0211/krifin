let code;

document.addEventListener("DOMContentLoaded", () => {
    code = document.querySelector("#code");

    code.addEventListener("keypress", e => {
        if (e.key === "Enter" && e.ctrlKey) {
            runit();
        }
    });
});