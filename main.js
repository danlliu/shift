let codearea = $('textarea#code');
let linenumbers = $('#line-numbers');

function codechange() {
    let numlines = codearea.val().split('\n').length;
    linenumbers.empty();
    for (let i = 0; i < numlines; ++i) {
        linenumbers.append(`${i+1}<br/>`)
    }
}

function compile() {
    let labels = {};

}

function execute() {
    let labels = compile();
}
