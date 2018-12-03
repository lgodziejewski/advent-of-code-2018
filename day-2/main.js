const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
    console.log('input: ', input);
    const firstResult = calculateFirstTask(input);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(input);
    console.log('second result: ', secondResult);
});

function calculateFirstTask(input) {

}

function calculateSecondTask(input) {

}
