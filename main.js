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
    line = line.trim();
    console.log(line);
    if (line.match(/^_PRINT_/)) {
        // print statement
        let parts = line.split(' ');
        console.log(parts);
        for (let i = 1; i < parts.length; i++) {
            let result = evaluate(parts[i], labels);
            if (result.val != null) {
                result = result.val;
            }
            else if (result.text != null) {
                result = result.text;
            }
            else {
                result = "error!";
            }
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
            let result = evaluate(parts[1], labels);
            if (result.val != null) return {val: result.val};
            else return {text: result.text};
        } else {
            let result = evaluate(parts[2], labels);
            if (result.val != null) return {val: result.val};
            else return {text: result.text};
        }
    } else if (line.match(/.*>.*/)) {
        let parts = line.split(/>(.+)/);
        let newvalue = evaluate(parts[0], labels).val;
        assignToValueReference(newvalue, evaluate(parts[1], labels), labels);
        return {val: newvalue};
    }

    else if (line.match(/.*_EQ_.*/)) {
        let parts = line.split(/_EQ_(.+)/);
        return {val: (evaluate(parts[0], labels).val === evaluate(parts[1], labels).val ? 1 : 0)};
    } else if (line.match(/.*_NEQ_.*/)) {
        let parts = line.split(/_NEQ_(.+)/);
        return {val: (evaluate(parts[0], labels).val === evaluate(parts[1], labels).val ? 0 : 1)};
    } else if (line.match(/.*_LT_.*/)) {
        let parts = line.split(/_LT_(.+)/);
        return {val: (evaluate(parts[0], labels).val < evaluate(parts[1], labels).val ? 1 : 0)};
    } else if (line.match(/.*_GT_.*/)) {
        let parts = line.split(/_GT_(.+)/);
        return {val: (evaluate(parts[0], labels).val > evaluate(parts[1], labels).val ? 1 : 0)};
    } else if (line.match(/.*_AND_.*/)) {
        let parts = line.split(/_AND_(.+)/);
        return {val: (evaluate(parts[0], labels).val !== 0 && evaluate(parts[1], labels).val !== 0 ? 1 : 0)};
    } else if (line.match(/.*_OR_.*/)) {
        let parts = line.split(/_OR_(.+)/);
        return {val: (evaluate(parts[0], labels).val !== 0 && evaluate(parts[1], labels).val !== 0 ? 1 : 0)};
    } else if (line.match(/_NOT_.*/)) {
        let negate = evaluate(line.substr(5), labels).val;
        return {val: (negate === 0 ? 1 : 0)};
    }

    else if (line.match(/.*\*.*/)) {
        let parts = line.split(/\*(.+)/);
        return {val: evaluate(parts[0], labels).val * evaluate(parts[1], labels).val};
    } else if (line.match(/.*\|.*/)) {
        let parts = line.split(/\|(.+)/);
        return {val: Math.floor(evaluate(parts[0], labels).val / evaluate(parts[1], labels).val)};
    } else if (line.match(/.*%.*/)) {
        let parts = line.split(/%(.+)/);
        return {val: evaluate(parts[0], labels).val % evaluate(parts[1], labels).val};
    } else if (line.match(/.*\+.*/)) {
        let parts = line.split(/\+(.+)/);
        return {val: evaluate(parts[0], labels).val + evaluate(parts[1], labels).val};
    } else if (line.match(/.*-.*/)) {
        let parts = line.split(/-(.+)/);
        return {val: evaluate(parts[0], labels).val - evaluate(parts[1], labels).val};
    }  else if (line.match(/@.*/)) {
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
        console.log(labels);
        if (labels[label] == null) {
            // invalid label
            output.append(`Error: undefined label ${label}`);
            return {};
        }
        nextPc = labels[label];
        return {};
    } else if (line.match(/^\^[0-9]+$/)) {
        // jump to number
        let value = parseInt(line.substr(1));
        nextPc = value - 1;
        return {};
    } else if (line.match(/!/)) {
        // halt
        nextPc = -1;
        return {};
    } else {
        return {text: line};
    }
}

function execute() {
    output.empty();
    let lines = codearea.val().split('\n');
    let labels = compile();
    console.log(labels);
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
        if (line.match(/^[A-Z]+:/)) {
            line = line.substr(line.indexOf(':') + 1);
        }
        evaluate(line, labels);
        console.log(globals);
        if (nextPc === -1) {
            break;
        }
        pc = nextPc;
    }
}
