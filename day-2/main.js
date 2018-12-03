const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
    const firstResult = calculateFirstTask(input);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(input);
    console.log('second result: ', secondResult);
});

function calculateFirstTask(input) {
    let twoSameLetterIDCount = 0;
    let threeSameLetterIDCount = 0;

    input.forEach(word => {
        const letters = countLetters(word);
        
        const results = hasTwoOrThreeSameLetters(letters);
        if (results.two) twoSameLetterIDCount++;
        if (results.three) threeSameLetterIDCount++;
    });

    return twoSameLetterIDCount * threeSameLetterIDCount;
}

function calculateSecondTask(input) {
    const ids = findTwoCloseIds(input);
    const position = getDifferentLetterPosition(ids.first, ids.second);

    const result = ids.first.substring(0, position) + ids.first.substring(position + 1);
    return result;
}

// task 1 helpers
function countLetters(word) {
    const result = {};
    word.split('').forEach(letter => {
        if (result[letter]) result[letter]++;
        else result[letter] = 1;
    });

    return result;
}

function hasTwoOrThreeSameLetters(letters) {
    const res = { two: false, three: false };

    Object.keys(letters).forEach(letter => {
        if (letters[letter] === 2) res.two = true;
        if (letters[letter] === 3) res.three = true;
    });

    return res;
}

// task 2 helpers
function findTwoCloseIds(ids) {
    for (let i = 0; i < ids.length - 1; i++) {
        for (let j = i + 1; j < ids.length; j++) {
            const count = getDifferentLettersCount(ids[i], ids[j]);
            if (count === 1) {
                return {
                    first: ids[i],
                    second: ids[j],
                };
            }
        }
    }
}

function getDifferentLettersCount(id1, id2) {
    let count = 0;
    for (let i = 0; i < id1.length; i++) {
        if (id1[i] !== id2[i]) count++;

        if (count > 1) break;
    }
    return count;
}

function getDifferentLetterPosition(id1, id2) {
    for (let i = 0; i < id1.length; i++) {
        if (id1[i] !== id2[i]) return i;
    }
}
