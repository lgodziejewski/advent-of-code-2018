const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(lines => {
    const firstResult = calculateFirstTask(lines);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(lines);
    console.log('second result: ', secondResult);
});

function calculateFirstTask(lines) {
    return lines.reduce((res, line) => res += +line, 0);
}

function calculateSecondTask(lines) {
    let currentFreq = 0;
    const frequenciesSet = new Set();
    frequenciesSet.add(currentFreq);
    let found = false;

    let repeat = 0;
    while(!found) {
        for (line of lines) {
            currentFreq = currentFreq + +line;

            if (frequenciesSet.has(currentFreq)) {
                found = true;
                break;
            } else {
                frequenciesSet.add(currentFreq);
            }
        }
    }

    return currentFreq;
}
