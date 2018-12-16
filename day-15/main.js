const { fileToArray } = require('../fileToArray');
const dir = __dirname;

const myData = {
    file: 'input',
    // ?
};

const testData0 = {
    file: 'test-0',
    result: 27730,
};

const testData1 = {
    file: 'test-1',
    result: 36334,
};

const testData2 = {
    file: 'test-2',
    result: 39514,
};

const testData3 = {
    file: 'test-3',
    result: 27755,
};

const testData4 = {
    file: 'test-4',
    result: 28944,
};

const testData5 = {
    file: 'test-5',
    result: 18740,
};

const usedData = testData0;

const playerType = {
    elf: 'elf',
    goblin: 'goblin',
};

const fieldType = {
    plain: 'plain',
    mountain: 'mountain',
};

const playerDefaults = {
    E: {
        type: playerType.elf,
        hp: 200,
        attack: 3,
    },
    G: {
        type: playerType.goblin,
        hp: 200,
        attack: 3,
    },
};

const mapDefaults = {
    'E': fieldType.plain,
    'G': fieldType.plain,
    '.': fieldType.plain,

    '#': fieldType.mountain,
};


fileToArray(dir, usedData.file).then(input => {
    const parsedInput = parseInput(input);

    const firstResult = calculateFirstTask(parsedInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(parsedInput);
    console.log('second result: ', secondResult);
});

function parseInput(input) {
    const map = [];
    const players = [];

    let rowId = 0;
    let playerId = 0;
    for (row of input) {
        const parsedRow = [];

        let colId = 0;
        const chars = row.split('');
        for (char of chars) {
            const position = { x: colId, y: rowId };

            // get field data
            const fieldObject = {
                type: mapDefaults[char],
                position,
            };
            parsedRow.push(fieldObject);

            // check if player
            if (char === 'G' || char === 'E') {
                const playerObject = {
                    ...playerDefaults[char],
                    position,
                    id: playerId,
                };
                playerId++;
                players.push(playerObject);
            }

            colId++;
        }

        map.push(parsedRow);
        rowId++;
    }

    return { map, players };
}

function calculateFirstTask(data) {
    const { map, players } = data;

    drawState(map, players);


    let end = false;
    let iter = 0;
}

function calculateSecondTask(data) {

}

const drawChars = {
    [fieldType.plain]: '.',
    [fieldType.mountain]: '#',
    [playerType.goblin]: 'G',
    [playerType.elf]: 'E',
};
function drawState(map, players) {
    const result = [];

    // draw map
    for (row of map) {
        const resultRow = [];

        for (el of row) {
            resultRow.push(drawChars[el.type]);
        }

        result.push(resultRow);
    }

    // draw players
    for (player of players) {
        const { x, y } = player.position;

        result[y][x] = drawChars[player.type];
    }

    const resultString = result.map(line => line.join('')).join('\n');
    console.log(resultString);
}
