const PNGImage = require('pngjs-image');
const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
    const { points: parsedInput, imageSize } = parseInput(input);

    const firstResult = calculateFirstTask(parsedInput, imageSize);
    console.log('first result: ', firstResult[0].size);

    const secondResult = calculateSecondTask(parsedInput, imageSize);
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
    { r: 250, g: 250, b: 50},
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
    }).sort((a, b) => a.x - b.x).map((el, id) => ({ id, ...el }));

    // find max y and y
    let x = 0, y = 0;
    points.forEach(point => {
        if (point.x > x) x = point.x;
        if (point.y > y) y = point.y;
    });

    // add points colors:
    points.forEach((point, index) => {
        point.color = colors[index % colors.length];
    });

    return { points, imageSize: { height: y + 1, width: x + 1 }};
}

function createBlankImage({ width, height }) {
    const image = PNGImage.createImage(width, height);
    image.fillRect(0, 0, width - 1, height - 1, rgba(255, 255, 255));

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

            // two points equally near, do nothing
            if (nearest.length > 1) {

            } else {
                const { r, g, b } = nearest[0].color;
                image.setAt(x, y, rgba(r, g, b));
                helper.push({ coords: { x, y }, point: nearest[0].id})   
            }
        }
    }

    /*
    point: {
      id,
      coords,
      color,
    };
    helper: [
      {
        coords: { x, y },
        point: <id>
      }
    ]
    */
    return { pixelWithAreaId: helper, width, height };
}

function isInDistance(curr, point, targetDistance) {
    const distance = Math.abs(point.x - curr.x) + Math.abs(point.y - curr.y);

    return distance === targetDistance;
}


function calculateFirstTask(parsedInput, imageSize) {
    const image = createBlankImage(imageSize);
    const { pixelWithAreaId, width, height} = drawVoronoi(image, parsedInput);
    // saveImage(image, 'first');

    // groups pixels by points
    const groupedByAreas = pixelWithAreaId.reduce((acc, el) => {
        if (!acc[el.point]) acc[el.point] = [];

        acc[el.point].push(el.coords);

        return acc;
    }, {});

    // filter out "border" areas
    const filteredAreaIds = Object.keys(groupedByAreas).filter(areaId => {
        // check if area contains x: 0, y: 0, x: width or y: width points
        const pixels = groupedByAreas[areaId];

        const isBorder = pixels.some(pixel => (pixel.x === 0 || pixel.x >= width - 1 || pixel.y === 0 || pixel.y >= height - 1));

        return !isBorder;
    });

    const filteredAreas = filteredAreaIds.map(areaId => ({
        id: areaId,
        size: groupedByAreas[areaId].length,
    })).sort((a, b) => b.size - a.size);


    return filteredAreas;
}

function calculateSecondTask() {
    const totalDistance = 10000;

}
