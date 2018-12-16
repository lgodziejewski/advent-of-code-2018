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

const testMove = {
    file: 'test-move',
}

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
        enemyType: playerType.goblin,
        type: playerType.elf,
        hp: 200,
        attack: 3,
    },
    G: {
        enemyType: playerType.elf,
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

    // add players to map
    for (player of players) {
        const { x, y } = player.position;
        map[y][x] = { type: player.type, position: { x, y } };
    }

    return { map, players };
}

function calculateFirstTask(data) {
    let { map, players } = data;

    drawState(map);

    let end = false;
    let iter = 1;

    while(!end) {
        // sort players "in reading order"
        players.sort(readingOrderSort);

        // determine next step for each
        for (player of players) {
            // dead, do nothing
            if (player.hp <= 0) continue;

            // identify if there are targets:
            const enemies = players.filter(el => (el.type === player.enemyType) && el.hp > 0);

            // no enemies, end
            if (enemies.length === 0) {
                end = true;
                break;
            }

            const myPos = player.position;
            const neighbouringCoords = [
                { x: myPos.x, y: myPos.y - 1}, { x: myPos.x - 1, y: myPos.y },
                { x: myPos.x + 1, y: myPos.y }, { x: myPos.x, y: myPos.y + 1}
            ];

            // check if any enemy is already in range:
            const inRange = neighbouringCoords.some(coord => map[coord.y][coord.x].type === player.enemyType);

            // move if nobody is in range
            if (!inRange) {
                // check each enemy if reachable:
                const tmpMap = {};
                for (enemy of enemies) {
                    tmpMap[enemy.id] = floodFill(map, enemy.position, player.position);
                }

                // get closest reachable enemy:
                const closest = {
                    len: 10000000,
                    id: 0,
                };
                const enemyIds = Object.keys(tmpMap);
                for (id of enemyIds) {
                    const enemyMap = tmpMap[id];

                    neighbouringCoords.forEach(coord => {
                        const field = enemyMap[coord.y][coord.x];
                        if (Number.isInteger(field)) {
                            if (field < closest.len) {
                                closest.len = field;
                                closest.id = id;
                                closest.pos = { x: coord.x, y: coord.y };
                            }
                        }
                    });
                }

                // do move
                if (closest.pos) {
                     player.position = { ...closest.pos };
                }
            }

            // TODO attack


            // calc new state - sb could have moved or be dead
            map = calcNewState(map, players);
        }

        console.log({ iter });
        drawState(map);

        iter++;
        
        if (iter > 5) break;
    }
}

function calculateSecondTask(data) {

}

function calcNewState(map, players) {
    const newState = [];
    for (row of map) {
        const newRow = [];
        for (el of row) {
            if (el.type === fieldType.mountain) {
                newRow.push({ ...el })
            } else {
                newRow.push({ type: fieldType.plain, position: el.position });
            }
        }
        newState.push(newRow);
    }
    // add current player state
    for (player of players) {
        // do not add dead players
        if (player.hp <= 0) continue;

        const { x, y } = player.position;
        newState[y][x] = { type: player.type, position: { x, y } };
    }
    return newState;
}

function floodFill(map, src, target) {
    // prepare result
    const tmpMap = [];
    for (row of map) {
        const tmpRow = [];
        for (el of row) {
            if (el.type !== fieldType.plain) {
                tmpRow.push('#');
            } else {
                tmpRow.push('.');
            }
        }
        tmpMap.push(tmpRow);
    }
    tmpMap[target.y][target.x] = 'T';

    // perform flood fill
    tmpMap[src.y][src.x] = 0;
    performFloodFill(tmpMap, src, 1);

    // console.log('test map:');
    // drawTmpMap(tmpMap);

    return tmpMap;
}

function performFloodFill(result, position, value) {
    // get list of valid neighbours:
    let currentPositions = getFilteredNeighboursArray(position, result);

    while (currentPositions.length > 0) {
        // set each to value
        currentPositions.forEach(el => result[el.y][el.x] = value);
        value++;

        let newPositions = [];
        currentPositions.forEach(el => {
            newPositions = newPositions.concat(getFilteredNeighboursArray(el, result));
        });

        currentPositions = newPositions;
    }
}

function getFilteredNeighboursArray(position, current) {
    const neighbours = [];
    neighbours.push({ x: position.x - 1, y: position.y });
    neighbours.push({ x: position.x, y: position.y - 1 });
    neighbours.push({ x: position.x + 1, y: position.y });
    neighbours.push({ x: position.x, y: position.y + 1 });

    // exclude impassable or already "valued" fields
    filteredNeighbours = neighbours.filter(pos => current[pos.y][pos.x] === '.');

    return filteredNeighbours;
}

function readingOrderSort(a, b) {
    if (a.position.y === b.position.y) return a.position.x - b.position.x;

    return a.position.y - b.position.y;
}

const drawChars = {
    [fieldType.plain]: '.',
    [fieldType.mountain]: '#',
    [playerType.goblin]: 'G',
    [playerType.elf]: 'E',
};
function drawState(map) {
    const result = [];

    // draw map
    for (row of map) {
        const resultRow = [];

        for (el of row) {
            resultRow.push(drawChars[el.type]);
        }

        result.push(resultRow);
    }

    const resultString = result.map(line => line.join('')).join('\n');
    console.log(resultString);
}

function drawTmpMap(map) {
    const result = [];

    // draw map
    for (row of map) {
        const resultRow = [];

        for (el of row) {
            resultRow.push(el);
        }

        result.push(resultRow);
    }

    const resultString = result.map(line => line.join('\t')).join('\n');
    console.log(resultString);
}
