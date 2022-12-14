const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
    const parsedInput = parseInput(input);

    calculateTasks(parsedInput);
});

const REGISTER_RE = /\[(.*)\]/;
function parseInput(input) {
    const inputData = [];

    let currentObj = {};
    for (let i = 0; i < input.length; i++) {
        if (i % 4 === 0) {
            const [_, inputArr] = REGISTER_RE.exec(input[i]);
            const before = inputArr.split(', ').map(Number);
            currentObj.before = before;
        } else if (i % 4 === 1) {
            const oper = input[i].split(' ').map(Number);
            currentObj.oper = oper;
        } else if (i % 4 === 2) {
            const [_, inputArr] = REGISTER_RE.exec(input[i]);
            const after = inputArr.split(', ').map(Number);
            currentObj.after = after;
        } else {
            inputData.push(currentObj);
            currentObj = {};
        }
    }

    return inputData;
}

let registers;

const functions = { addr, addi, mulr, muli, banr, bani, borr, bori, setr, seti, gtir, gtri, gtrr, eqir, eqri, eqrr };

function addr(a, b, c) {
    registers[c] = registers[a] + registers[b];
}

function addi(a, b, c) {
    registers[c] = registers[a] + b;
}

function mulr(a, b, c) {
    registers[c] = registers[a] * registers[b];
}

function muli(a, b, c) {
    registers[c] = registers[a] * b;
}

function banr(a, b, c) {
    registers[c] = registers[a] & registers[b];
}

function bani(a, b, c) {
    registers[c] = registers[a] & b;
}

function borr(a, b, c) {
    registers[c] = registers[a] | registers[b];
}

function bori(a, b, c) {
    registers[c] = registers[a] | b;
}

function setr(a, b, c) {
    registers[c] = registers[a];
}

function seti(a, b, c) {
    registers[c] = a;
}

function gtir(a, b, c) {
    registers[c] = (a > registers[b] ? 1 : 0);
}

function gtri(a, b, c) {
    registers[c] = (registers[a] > b ? 1 : 0);
}

function gtrr(a, b, c) {
    registers[c] = (registers[a] > registers[b] ? 1 : 0);
}

function eqir(a, b, c) {
    registers[c] = (a === registers[b] ? 1 : 0);
}

function eqri(a, b, c) {
    registers[c] = (registers[a] === b ? 1 : 0);
}

function eqrr(a, b, c) {
    registers[c] = (registers[a] === registers[b] ? 1 : 0);
}

const opcodeFuncMap = {
    '0': setr,
    '1': eqrr,
    '2': gtri,
    '3': muli,
    '4': eqir,
    '5': borr,
    '6': bori,
    '7': mulr,
    '8': gtrr,
    '9': seti,
    '10': banr,
    '11': eqri,
    '12': addr,
    '13': gtir,
    '14': addi,
    '15': bani,
};

function calculateTasks(data) {
    // for each entry iterate over each function and verify if function result is same as input result
    // if yes - increment function usage for given op-code
    const opCodes = {};
    let firstResult = 0;
    const funcKeys = Object.keys(functions);
    for (let i = 0; i <= 15; i++) {
        opCodes[i] = {};
        for (key of funcKeys) {
            opCodes[i][key] = 0;
        }
    }

    for (entry of data) {
        const { before, after, oper } = entry;
        const [opcode, a, b, c] = oper;

        let matching = 0;
        for (funcKey of funcKeys) {
            // set input
            registers = [ ...before ];

            // invoke oper
            functions[funcKey](a, b, c);

            // if result OK, increment opcode-func mapping
            if (after.toString() === registers.toString()) {
                opCodes[opcode][funcKey]++;
                matching++;
            }
        }

        if (matching >= 3) {
            firstResult++;
        }
    }

    console.log('first result: ', firstResult);
    // console.log(opCodes);

    // 2nd task
    fileToArray(dir, 'input2').then(operations => {
        registers = [0, 0, 0, 0];

        for (row of operations) {
            const [operCode, a, b, c] = row.split(' ').map(Number);

            const func = opcodeFuncMap[operCode];

            func(a, b, c);
        }

        console.log(registers);
    });
}
