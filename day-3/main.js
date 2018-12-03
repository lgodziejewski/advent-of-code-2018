const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
    const parsedInput = parseInput(input);

    const firstResult = calculateFirstTask(parsedInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(input);
    console.log('second result: ', secondResult);
});

const CLAIM_RE = /(\d+),(\d+): (\d+)x(\d+)/;
function parseInput(input) {
    return input.map((line, index) => {
        const match = CLAIM_RE.exec(line);
        return {
            id: index + 1,
            x: +match[1],
            y: +match[2],
            width: +match[3],
            height: +match[4],
        };
    });
}

const canvasSize = 1000;
// find all square inches that are claimed more than once
function calculateFirstTask(input) {
    const canvas = prepareCanvas(canvasSize);

    // apply each claim
    input.forEach(claim => {
        applyClaim(canvas, claim);
    })

    // go "pixel by pixel" and count each with value > 1
    let count = 0;
    for (row of canvas) {
        for (cell of row) {
            if (cell > 1) count++;
        }
    }

    return count;
}

// first task helpers
function prepareCanvas(size) {
    res = [];
    for (let i = 0; i < size; i++) {
        const arr = Array(size).fill(0);
        res.push(arr);
    }
    return res;
}

function applyClaim(canvas, claim) {
    for (let i = 0; i < claim.width; i++) {
        for (let j = 0; j < claim.height; j++) {
            canvas[claim.x + i][claim.y + j]++;
        }
    }
}

function calculateSecondTask() {

}