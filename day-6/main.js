const PNGImage = require('pngjs-image');
const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
    const parsedInput = parseInput(input);

    saveImage(parsedInput, 'start');
    const firstResult = calculateFirstTask(parsedInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(parsedInput);
    console.log('second result: ', secondResult);
});

colors = [
    { r: 0, g: 0, b: 0 },
    { r: 100, g: 150, b: 0 },
    { r: 0, g: 100, b: 150 },
    { r: 100, g: 0, b: 150 },
    { r: 50, g: 50, b: 50},
    { r: 150, g: 50, b: 50},
    { r: 50, g: 150, b: 50},
    { r: 50, g: 50, b: 150},
    { r: 250, g: 50, b: 50},
    { r: 50, g: 250, b: 50},
    { r: 50, g: 50, b: 250},
    { r: 250, g: 0, b: 50},
    { r: 50, g: 250, b: 0},
    { r: 0, g: 50, b: 250},
    { r: 250, g: 0, b: 150},
    { r: 150, g: 250, b: 0},
    { r: 0, g: 150, b: 250},
    { r: 250, g: 50, b: 150},
    { r: 150, g: 250, b: 50},
    { r: 50, g: 150, b: 250},
]

function saveImage(image, name) {
    image.writeImage(`${name}.png`, function (err) {
        if (err) throw err;
        console.log('Written to the file');
    });
}

function parseInput(input) {
    const points = input.map(row => {
        const [x, y] = row.split(', ').map(el => +el);

        return {
            x,
            y,
        };
    }).sort((a, b) => a.x - b.x);

    // find max y and y
    let x = 0, y = 0;
    points.forEach(point => {
        if (point.x > x) x = point.x;
        if (point.y > y) y = point.y;
    });

    const image = PNGImage.createImage(x, y);
    image.fillRect(0, 0, x, y, rgba(255, 255, 255));

    // add points:
    points.forEach((point, index) => {
        const color = colors[index % colors.length];
        point.color = color;
        image.setAt(point.x, point.y, rgba(color.r, color.g, color.b));
    });

    drawVoronoi(image, points);

    return image;
}

function rgba(red, green, blue, alpha = 1.0) {
    return {
        red,
        green,
        blue,
        alpha: alpha * 255,
    };
}

function drawVoronoi(image, points) {
    const width = image.getWidth();
    const height = image.getHeight();

    const helper = [];
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let distance = -1;
            let nearest = [];
            while (nearest.length === 0) {
                distance++;
                for (point of points) {
                    if (isInDistance({ x, y }, point, distance)) {
                        nearest.push(point);
                    }
                }
            }

            // checking point coords or two points equally near, do nothing
            if (distance === 0 || nearest.length > 1) {

            } else {
                const { r, g, b } = nearest[0].color;
                image.setAt(x, y, rgba(r, g, b));
                helper.push({ coords: { x, y }, point: nearest[0]})   
            }
        }
    }
}

function isInDistance(curr, point, targetDistance) {
    const distance = Math.abs(point.x - curr.x) + Math.abs(point.y - curr.y);

    return distance === targetDistance;
}


function calculateFirstTask() {

}

function calculateSecondTask() {

}
