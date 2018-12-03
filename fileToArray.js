const fs = require('fs');
const path = require('path');
const readline = require('readline');

module.exports.fileToArray = function fileToArray(dir, fileName) {
    const inputPath = path.format({ dir, base: fileName });
    const reader = readline.createInterface(fs.createReadStream(inputPath));

    return new Promise(resolve => {
        const lines = [];
        reader.on('line', line => lines.push(line));
        
        reader.on('close', () => {
            resolve(lines);
        });
    });
}