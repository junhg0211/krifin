// output functions are configurable.  This one just appends some text
// to a pre element.
function outf(text) { 
    var mypre = document.getElementById("stdout"); 
    mypre.innerHTML = mypre.innerHTML + text; 
} 
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

function inputfun() {
    return inputStack.pop();
}

// Here's everything you need to run a python program in skulpt
// grab the code from your textarea
// get a reference to your pre element for output
// configure the output function
// call Sk.importMainWithBody()
function runit(stdin) { 
    var prog = document.getElementById("code").value;
    var mypre = document.getElementById("stdout");
    mypre.innerHTML = '';

    Sk.pre = "output";
    Sk.configure({
        output: outf,
        read: builtinRead,
        inputfun: stdin !== undefined ? inputfun : null
    });

    var myPromise = Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    myPromise.then(function (mod) {
        // console.log('success');
    }, function (err) {
        outf(err.toString());
    });
} 