const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
    const parsedInput = parseInput(input);

    const firstResult = calculateFirstTask(parsedInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(parsedInput);
    console.log('second result: ', secondResult);
});

function parseInput(input) {

}

function calculateFirstTask(data) {

}

function calculateSecondTask(data) {

}
