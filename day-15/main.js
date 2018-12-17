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

const usedData = myData;

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
        map[y][x] = { type: player.type, id: player.id };
    }

    return { map, players };
}

function calculateFirstTask(data) {
    const { map: initialMap, players } = data;

    let map = initialMap;
    // drawState(map);

    let end = false;
    let iter = 1;

    while(!end) {
        // console.log('---', { iter });
        // sort players "in reading order"
        players.sort(readingOrderSort);

        const goblinsAlive = players.filter(el => el.type === playerType.goblin && el.hp > 0).length;
        const elfsAlive = players.filter(el => el.type === playerType.elf && el.hp > 0).length;

        if (goblinsAlive <= 0 || elfsAlive <= 0) {
            end = true;
            break;
        }

        let fullRound = true;
        // determine next step for each
        for (player of players) {
            // dead, do nothing
            if (player.hp <= 0) continue;

            // identify if there are targets:
            const enemies = players.filter(el => (el.type === player.enemyType) && el.hp > 0);

            // no enemies, end
            if (enemies.length === 0) {
                fullRound = false;
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
                    if (enemy.hp <= 0) continue;

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
                    // console.log(`player ${player.id} moves to position: `, { position: closest.pos });
                    map[player.position.y][player.position.x] = { type: fieldType.plain };
                    player.position = { ...closest.pos };
                    map[player.position.y][player.position.x] = { type: player.type, id: player.id };
                    // drawState(map);
                }
            }

            // get new neighbouring positions
            const myNewPos = player.position;
            const newNeighbouringCoords = [
                { x: myNewPos.x, y: myNewPos.y - 1}, { x: myNewPos.x - 1, y: myNewPos.y },
                { x: myNewPos.x + 1, y: myNewPos.y }, { x: myNewPos.x, y: myNewPos.y + 1}
            ];

            // attack - get enemy in range, if any
            const enemiesInRange = [];
            newNeighbouringCoords.forEach(coord => {
                if (map[coord.y][coord.x].type === player.enemyType) {
                    const enemyId = map[coord.y][coord.x].id;
                    const enemy = enemies.find(el => el.id === enemyId);
                    enemiesInRange.push(enemy);
                }
            });

            if (enemiesInRange.length > 0) {
                enemiesInRange.sort((a, b) => a.hp - b.hp);
                const enemy = enemiesInRange[0];

                // attack:
                enemy.hp -= 3;
                // console.log(`player ${player.id} attacks enemy ${enemyId}. Hp left: ${enemy.hp}`);

                if (enemy.hp <= 0) {
                    // recalc state, enemy died
                    map[enemy.position.y][enemy.position.x] = { type: fieldType.plain };
                }
            }
        }

        // drawState(map);

        if (fullRound) {
            iter++;
        }
    }

    const fullRounds = iter - 1;
    const alivePlayers = players.filter(el => el.hp > 0);
    const hpSum = alivePlayers.reduce((acc, el) => acc + el.hp, 0);
    const result = fullRounds * hpSum;
    console.log({ fullRounds, hpSum });
    console.log('result: ', result);
    console.log('expected result: ', usedData.result);
}

function calculateSecondTask(data) {

}

// remove me
function calcNewState(map, players) {
    const newState = [];
    for (row of map) {
        const newRow = [];
        for (el of row) {
            if (el.type === fieldType.mountain) {
                newRow.push({ ...el })
            } else {
                newRow.push({ type: fieldType.plain });
            }
        }
        newState.push(newRow);
    }
    // add current player state
    players.forEach(player => {
        // do not add dead players
        if (player.hp <= 0) return;

        const { x, y } = player.position;
        newState[y][x] = { type: player.type, id: player.id };
    });
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
    performFloodFill(tmpMap, src, target);

    // console.log('test map:');
    // drawTmpMap(tmpMap);

    return tmpMap;
}

function performFloodFill(result, position, target) {
    // get list of valid neighbours:
    const { filteredNeighbours: filNeight, isTarget: initialIsTarget } = getFilteredNeighboursArray(position, target, result);
    let currentPositions = filNeight;
    let value = 1;

    let targetReached = initialIsTarget;
    while (!targetReached && currentPositions.length > 0) {
        // set each to value
        currentPositions.forEach(el => result[el.y][el.x] = value);
        value++;

        let newPositions = [];
        for (el of currentPositions) {
            const { filteredNeighbours, isTarget } = getFilteredNeighboursArray(el, target, result);
            newPositions = newPositions.concat(filteredNeighbours);

            if (isTarget) {
                targetReached = true;
                break;
            }
        }

        currentPositions = newPositions;
    }
}

function getFilteredNeighboursArray(position, target, current) {
    const neighbours = [];
    neighbours.push({ x: position.x - 1, y: position.y });
    neighbours.push({ x: position.x, y: position.y - 1 });
    neighbours.push({ x: position.x + 1, y: position.y });
    neighbours.push({ x: position.x, y: position.y + 1 });

    // exclude impassable or already "valued" fields
    filteredNeighbours = neighbours.filter(pos => current[pos.y][pos.x] === '.');

    const isTarget = neighbours.some(pos => pos.x === target.x && pos.y === target.y);

    return { filteredNeighbours, isTarget };
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
