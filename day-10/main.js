const PNGImage = require('pngjs-image');
const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
    const parsedInput = parseInput(input);

    const firstResult = calculateFirstTask(parsedInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(parsedInput);
    console.log('second result: ', secondResult);
});

const INPUT_RE = /position=< ?(-?\d+),  ?(-?\d+)> velocity=< ?(-?\d+),  ?(-?\d+)>/;
function parseInput(input) {
    const points = input.map(row => {
        const [_, x, y, velX, velY] = INPUT_RE.exec(row);

        return {
            position: { x: +x, y: +y },
            velocity: { x: +velX, y: +velY },
        };
    });

    return points;
}

function calculateFirstTask(data) {

    console.log('points count: ', data.length);

    // const { width, height } = getRectangle(data);

    // console.log({ width, height });

    for (let i = 1; i <= 10639; i++) {
        data.forEach(el => {
            el.position.x += el.velocity.x;
            el.position.y += el.velocity.y;
        });

        // const { width, height, minX, minY } = getRectangle(data);

        // console.log(`step ${i}: `, { width, height });
    }

    const { width, height, minX, minY } = getRectangle(data);
    const paddedWidth = width + 10;
    const paddedHeight = height + 10;

    const image = PNGImage.createImage(paddedWidth, paddedHeight);
    image.fillRect(0, 0, paddedWidth - 1, paddedHeight - 1, rgba(255, 255, 255));
    data.forEach(el => {
        image.setAt(el.position.x - minX, el.position.y - minY, rgba(0, 0, 0));
    });

    saveImage(image, 'result');
}

function rgba(r, g, b, a = 1.0) {
    return {
        red: r,
        green: g,
        blue: b,
        alpha: a * 255,
    };
}

function saveImage(image, name) {
    image.writeImage(`${name}.png`, function (err) {
        if (err) throw err;
        console.log('Written to the file');
    });
}

function getRectangle(data) {
    const xArray = data.map(el => el.position.x);
    const maxX = Math.max(...xArray);
    const minX = Math.min(...xArray);
    const width = maxX - minX;

    const yArray = data.map(el => el.position.y);
    const maxY = Math.max(...yArray);
    const minY = Math.min(...yArray);
    const height = maxY - minY;

    return { width, height, minX, minY };
}

function calculateSecondTask(data) {

}
