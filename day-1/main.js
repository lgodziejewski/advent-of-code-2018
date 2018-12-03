const fs = require('fs');
const readline = require('readline');

const reader = readline.createInterface(fs.createReadStream('./input'));

const lines = [];
reader.on('line', line => lines.push(+line));

reader.on('close', () => {
    const result = lines.reduce((res, value) => res += value, 0);

    console.log('result: ', result);
})
