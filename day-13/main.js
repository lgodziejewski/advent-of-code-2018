const { fileToArray } = require('../fileToArray');
const dir = __dirname;

const myData = {
    file: 'input',
};

const testData = {
    file: 'test',
}

const testData2 = {
    file: 'test2',
}

const usedData = myData;

const fieldType = {
    vertical: 0,
    horizontal: 1,
    curveLeft: 2,
    curveRight: 3,
    cross: 4,
    empty: 5,
};

const signs = {
    [fieldType.vertical]: '|',
    [fieldType.horizontal]: '-',
    [fieldType.curveLeft]: '/',
    [fieldType.curveRight]: '\\',
    [fieldType.cross]: '+',
    [fieldType.empty]: ' ',
};

const cartSigns = {
    up: '^',
    right: '>',
    down: 'v',
    left: '<',
};

const turnMap = {
    left: {
        up: 'left',
        right: 'up',
        down: 'right',
        left: 'down',
    },
    straight: {
        up: 'up',
        right: 'right',
        down: 'down',
        left: 'left',
    },
    right: {
        up: 'right',
        right: 'down',
        down: 'left',
        left: 'up',
    },
};

const nextTurn = {
    left: 'straight',
    straight: 'right',
    right: 'left',
};

const rightCurveMap = {
    up: 'left',
    right: 'down',
    left: 'up',
    down: 'right',
};

const leftCurveMap = {
    up: 'right',
    right: 'up',
    down: 'left',
    left: 'down',
};

fileToArray(dir, usedData.file).then(input => {
    const parsedInput = parseInput(input);

    const firstResult = calculateFirstTask(parsedInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(parsedInput);
    console.log('second result: ', secondResult);
});

function parseInput(input) {
    const result = [];
    const carts = [];
    let rowId = 0;
    let cartId = 0;
    for (row of input) {
        const parsedRow = [];
        const chars = row.split('');
        let colId = 0;
        for (char of chars) {
            const position = { x: colId, y: rowId };
            const up = { x: colId, y: rowId - 1 };
            const right = { x: colId + 1, y: rowId };
            const down = { x: colId, y: rowId + 1 };
            const left = { x: colId - 1, y: rowId };

            let road = { position, type: fieldType.empty };

            if (char === '|' || char === '^' || char === 'v') {
                road = {
                    type: fieldType.vertical,
                    position,
                    next: { up, down },
                };
            } else if (char === '-' || char === '<' || char === '>') {
                road = {
                    type: fieldType.horizontal,
                    position,
                    next: { left, right },
                };
            } else if (char === '+') {
                road = {
                    type: fieldType.cross,
                    position,
                    next: { up, right, down, left },
                };
            } else if (char === '/') {
                // bottom-right
                if (chars[colId - 1] === '-') {
                    road = {
                        type: fieldType.curveLeft,
                        position,
                        next: { left, up },
                    };
                // top-left
                } else {
                    road = {
                        type: fieldType.curveLeft,
                        position,
                        next: { right, down },
                    };
                }
            } else if (char === '\\') {
                // top-right
                if (chars[colId - 1] === '-') {
                    road = {
                        type: fieldType.curveRight,
                        position,
                        next: { left, down },
                    };
                // bottom-left
                } else {
                    road = {
                        type: fieldType.curveRight,
                        position,
                        next: { right, up },
                    };
                }
            }

            let cart;
            const nextTurn = 'left';
            // carts
            switch (char) {
                case '<':
                    cart = { id: cartId, position, orientation: 'left', nextTurn };
                    break;
                case '^':
                    cart = { id: cartId, position, orientation: 'up', nextTurn };
                    break;
                case '>':
                    cart = { id: cartId, position, orientation: 'right', nextTurn };
                    break;
                case 'v':
                    cart = { id: cartId, position, orientation: 'down', nextTurn };
                    break;
                default:
                    // do nothing
            }

            if (cart) {
                cartId++;
                carts.push(cart);
            }

            if (road) parsedRow.push(road);
            colId++;
        }

        result.push(parsedRow);
        rowId++;
    }

    return { map: result, carts };
}

function printMap({ map, carts }, crashCoords) {
    const result = [];

    for (row of map) {
        const resultRow = [];
        for (el of row) {
            resultRow.push(signs[el.type]);
        }
        result.push(resultRow);
    }

    for (cart of carts) {
        result[cart.position.y][cart.position.x] = cartSigns[cart.orientation];
    }

    if (crashCoords) result[crashCoords.y][crashCoords.x] = 'X';

    const printedRows = result.map(row => row.join(''));
    console.log(printedRows.join('\n'));
}

function calculateFirstTask(data) {

    const { map, carts: oldCarts } = data;
    const carts = JSON.parse(JSON.stringify(oldCarts));
    let crash = false;
    let iter = 0;
    while (!crash) {
        // sort carts on each iteration, so that they move y first, x second
        carts.sort((a, b) => {
            if (a.position.y === b.position.y) return a.position.x - b.position.x;

            return a.position.y - b.position.y;
        });

        for (cart of carts) {
            const nextPosition = getNextPosition(cart.position, cart.orientation);
            
            // check crash
            const isCrash = carts.some(cart => cart.position.x === nextPosition.x && cart.position.y === nextPosition.y);
            if (isCrash) {
                crash = nextPosition;
            }
            
            const nextField = map[nextPosition.y][nextPosition.x];

            // cart.nextTurn changed inside
            const nextOrientation = getNextOrientation(cart, nextField)
            cart.position = nextPosition,
            cart.orientation = nextOrientation;
        }

        iter++;
    }

    // console.log('crash!');
    // printMap(data, crash);

    return crash;
}

function calculateSecondTask(data) {
    const { map, carts: oldCarts } = data;
    let carts = JSON.parse(JSON.stringify(oldCarts));
    let currentCarts = carts;
    let iter = 0;
    while (currentCarts.length > 1) {
        // sort carts on each iteration, so that they behave y first, x second
        currentCarts.sort((a, b) => {
            if (a.position.y === b.position.y) return a.position.x - b.position.x;

            return a.position.y - b.position.y;
        });

        const cartsToBeRemoved = [];
        for (cart of currentCarts) {
            const nextPosition = getNextPosition(cart.position, cart.orientation);
            
            // check crash
            const otherCart = currentCarts.find(cart => cart.position.x === nextPosition.x && cart.position.y === nextPosition.y);
            if (otherCart) {
                cartsToBeRemoved.push(cart);
                cartsToBeRemoved.push(otherCart);
            }
            
            const nextField = map[nextPosition.y][nextPosition.x];

            // cart.nextTurn changed inside
            const nextOrientation = getNextOrientation(cart, nextField)
            cart.position = nextPosition,
            cart.orientation = nextOrientation;
        }

        if (currentCarts.length === 1) {
            console.log('last cart left, stopping');
            stop = true;
        }

        if (cartsToBeRemoved.length > 0) {
            for (removedCart of cartsToBeRemoved) {
                currentCarts = currentCarts.filter(cart => cart.id !== removedCart.id);
            }
        }

        iter++;
    }

    return currentCarts;
}

function getNextPosition(position, orientation) {
    const diffs = {
        up: { x: 0, y: -1 },
        right: { x: 1, y: 0 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
    };
    const diff = diffs[orientation];

    return {
        x: position.x + diff.x,
        y: position.y + diff.y,
    };
}

function getNextOrientation(cart, field) {
    let nextOrientation;
    if (field.type === fieldType.vertical || field.type === fieldType.horizontal) {
        nextOrientation = cart.orientation;
    } else if (field.type === fieldType.curveRight) {
        nextOrientation = rightCurveMap[cart.orientation];
    } else if (field.type === fieldType.curveLeft) {
        nextOrientation = leftCurveMap[cart.orientation];
    } else if (field.type === fieldType.cross) {
        nextOrientation = turnMap[cart.nextTurn][cart.orientation];
        cart.nextTurn = nextTurn[cart.nextTurn];
    }

    return nextOrientation;
}
