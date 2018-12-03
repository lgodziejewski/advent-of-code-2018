const fs = require('fs');
const path = require('path');
const readline = require('readline');

const inputPath = path.format({ dir: __dirname, base: 'input' });
const reader = readline.createInterface(fs.createReadStream(inputPath));

const lines = [];
reader.on('line', line => lines.push(+line));

reader.on('close', () => {
    const firstResult = calculateFirstTask(lines);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(lines);
    console.log('second result: ', secondResult);
})

function calculateFirstTask(lines) {
    return lines.reduce((res, line) => res += line);
}

function calculateSecondTask(lines) {
    let currentFreq = 0;
    const frequenciesSet = new Set();
    frequenciesSet.add(currentFreq);
    let found = false;

    let repeat = 0;
    while(!found) {
        for (line of lines) {
            currentFreq = currentFreq + line;

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
