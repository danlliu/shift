let codearea = $('textarea#code');
let linenumbers = $('#line-numbers');
let output = $('#output');

function codechange() {
    let numlines = codearea.val().split('\n').length;
    linenumbers.empty();
    for (let i = 0; i < numlines; ++i) {
        linenumbers.append(`${i+1}<br/>`)
    }
}

function compile() {
    let labels = {};
    let lines = codearea.val().split('\n');
    for (let i = 0; i < lines.length; ++i) {
        if (lines[i].match(/^[A-Z]+:/)) {
            if (labels[lines[i].split(':')[0]] != null) {
                output.innerHTML = "Error: duplicate labels.";
                return -1;
            }
            labels[lines[i].split(':')[0]] = i;
        }
    }
    return labels;
}

let globals;
let mem;

function assignToValueReference(newValue, ref) {
    if (ref.memAddr != null) {
        // it's in memory
        mem[ref.memAddr] = newValue;
    } else {
        console.log(ref.varIdx);
        globals[ref.varIdx] = newValue;
    }
}

let nextPc = 0;

function evaluate(line, labels) {
    console.log(line);
    if (line.match(/^_PRINT_/)) {
        // print statement
        let parts = line.split(' ');
        console.log(parts);
        for (let i = 1; i < parts.length; i++) {
            let result = evaluate(parts[i], labels).val;
            console.log(`Result: ${result}`);
            output.append(`${result} `);
        }
        output.append(`<br/>`);
        console.log('end print call');
        return {};
    } else if (line.match(/.*?.*:.*/)) {
        // ternary
        let parts = line.split(/[?:]/);
        if (evaluate(parts[0], labels).val !== 0) {
            evaluate(parts[1], labels);
        } else {
            evaluate(parts[2], labels);
        }
        return {};
    } else if (line.match(/.*>.*/)) {
        let parts = line.split('>');
        let newvalue = evaluate(parts[0], labels).val;
        assignToValueReference(newvalue, evaluate(parts[1], labels), labels);
        return {val: newvalue};
    } else if (line.match(/@.*/)) {
        let addr = evaluate(line.substr(1), labels).val;
        return {memAddr: addr, val: mem[addr]};
    } else if (line.match(/^\$[A-Z]$/)) {
        let varname = line[1].charCodeAt(0);
        return {varIdx: varname - 65, val: globals[varname - 65]};
    } else if (line.match(/^#[0-9]+$/)) {
        let value = parseInt(line.substr(1));
        return {val: value};
    } else if (line.match(/^\^[A-Z]+$/)) {
        // jump to label
        let label = line.substr(1);
        if (labels[label] == null) {
            // invalid label
            output.append('Error: undefined label');
            return {};
        }
        nextPc = labels[label];
        return {};
    } else if (line.match(/^\^[0-9]+$/)) {
        // jump to number
        let value = parseInt(line.substr(1));
        nextPc = value;
        return {};
    } else if (line.match(/!/)) {
        // halt
        nextPc = -1;
        return {};
    } else {
        return {val: line};
    }
}

function execute() {
    output.empty();
    let lines = codearea.val().split('\n');
    let labels = compile();
    if (labels === -1) {
        codearea.toggleAttribute("readonly", true);
        return;
    }
    globals = Array(26);
    for (let i = 0; i < 26; ++i) {
        globals[i] = 0;
    }

    mem = Array(256);
    for (let i = 0; i < 256; ++i) {
        mem[i] = 0;
    }

    let pc = 0;

    while (true) {
        if (pc >= lines.length) {
            break;
        }
        // get line
        nextPc = pc + 1;
        let line = lines[pc];
        evaluate(line, globals, mem, labels);
        console.log(globals);
        if (nextPc === -1) {
            break;
        }
        pc = nextPc;
    }
}
