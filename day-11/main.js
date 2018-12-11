const input = 7315;
// const input = 18;
// const input = 42;

const size = 300;
const maxSize = 300;

// test cases:
// console.log('level: ', getPowerLevel(3, 5, 8));
// console.log('level: ', getPowerLevel(122, 79, 57));
// console.log('level: ', getPowerLevel(217, 196, 39));
// console.log('level: ', getPowerLevel(101, 153, 71));

main();

function main() {
  const parsedInput = prepareData();

  const firstResult = calculateFirstTask(parsedInput);
  console.log('first result: ', firstResult);

  const secondResult = calculateSecondTask(parsedInput);
  console.log('second result: ', secondResult);
}

function prepareData() {
  const data = [];
  for (let i = 0; i < size; i++) {
    data[i] = [];
    for (let j = 0; j < size; j++) {

      const level = getPowerLevel(i + 1, j + 1, input);

      data[i][j] = {
        position: { x: i + 1, y: j + 1 },
        id: i + 11,
        level,
        value: level,
      };
    }
  }

  return data;
}

function getPowerLevel(x, y, serialNo) {
  const rackId = x + 10;
  const powerLevel = ((rackId * y) + serialNo) * rackId;
  const powerLevelString = powerLevel.toString();
  const hundertDigit = (powerLevel < 100) ? 0 : (powerLevelString.charAt(powerLevelString.length - 3));
  const level = hundertDigit - 5;

  return level;
}

function calculateFirstTask(data) {
  const bestResult = {
    position: null,
    value: -1000,
  };

  for (let fieldSize = 1; fieldSize <= maxSize; fieldSize++) {
    for (let i = 0; i < size - (fieldSize - 1); i++) {
      for (let j = 0; j < size - (fieldSize - 1); j++) {
        recalcSquareValue(data, i, j, fieldSize);
        if (data[i][j].value > bestResult.value) {
          bestResult.value = data[i][j].value,
          bestResult.position = {
            x: i + 1,
            y: j + 1,
            fieldSize,
          };
        }
      }
    }
    // console.log({ fieldSize, bestResult });
  }

  return bestResult;
}

function printData(data) {
  for (row of data) {
    const text = [];
    for (col of row) {
      text.push(col.level);
    }
    console.log(text.join(' '));
  }
}

function recalcSquareValue(data, x, y, fieldSize) {
  let value = 0;
  const prevValue = data[x][y].value;
  if (fieldSize === 1) return prevValue;

  const tempX = x + fieldSize - 1;
  for (let j = y; j < y + fieldSize; j++) {
    value += data[tempX][j].level;
  }
  const tempY = y + fieldSize - 1;
  for (let i = x; i < x + fieldSize - 1; i++) {
    value += data[i][tempY].level;
  }

  const newValue = prevValue + value;
  // console.log({ x, y, newValue });
  data[x][y].value = newValue;
  return newValue;
}

function calculateSecondTask(data) {

}
