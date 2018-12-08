const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
  
  const parsedInput = parseInput(input);

  // clone input
    const firstResult = calculateFirstTask(parsedInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(parsedInput);
    console.log('second result: ', secondResult);
});

const LINE_RE = /Step (\w) must .* step (\w) can/;
function parseInput(input) {
  const allLetters = new Set();
  const parsedLetters = input.map(line => {
    const [_, parent, letter] = LINE_RE.exec(line);

    allLetters.add(parent);
    allLetters.add(letter);
    return { letter, parent };
  });

  const allLettersArray = Array.from(allLetters).sort();

  // group by letter
  const lettersWithParents = parsedLetters.reduce((acc, { letter, parent }) => {

    if (!acc[letter]) acc[letter] = [];

    acc[letter].push(parent);

    return acc;
  }, {});

  // add letters with no dependencies
  for (letter of allLettersArray) {
    if (!lettersWithParents[letter]) lettersWithParents[letter] = [];
  }

  /*
  [
    {
      letter
      parents: [parent-letters]
    }
  ]
  */
  const result = Object.keys(lettersWithParents).map(letter => {
    return {
      letter,
      parents: lettersWithParents[letter],
    };
  }).sort((a, b) => a.letter.charCodeAt(0) - b.letter.charCodeAt(0));

  return result;
}

function calculateFirstTask(input) {
  // console.log('input: ', input);
  /*
   loop (sorted input):
   -> 
     - get all letters with no dependencies
     - get first, add to result string, remove from each dependency array
   ^--- repeat
   */
  const targetLength = input.length;
  // copy input
  const currentInput = JSON.parse(JSON.stringify(input));
  const result = [];
  while (result.length < targetLength) {
    const firstLetterWithoutDepsIndex = currentInput.findIndex(entry => entry.parents.length === 0);
    const currentEntry = currentInput.splice(firstLetterWithoutDepsIndex, 1)[0];

    result.push(currentEntry.letter);

    for (dependentEntry of currentInput) {
      let parents = dependentEntry.parents.join('');
      parents = parents.replace(currentEntry.letter, '');
      dependentEntry.parents = parents.split('');
    }
  }

  return result.join('');
}

function calculateSecondTask(input) {
  const baseStepTime = 60;
  const letterDiff = 64;
  
  // initialize workers
  const WORKER_COUNT = 5;
  const currentJobs = [];
  for (let i = 0; i < WORKER_COUNT; i++) currentJobs.push({ letter: '', time: 0});

  // copy input
  const currentInput = JSON.parse(JSON.stringify(input));
  const targetLength = input.length;

  const result = [];
  let globalTime = -1;
  while (result.length < targetLength) {
    // next "frame"
    globalTime++;

    // get "finished" workers
    const finishedWorkers = currentJobs.filter(worker => worker.time <= globalTime);
    for (worker of finishedWorkers) {

      // skip empty letter
      if (worker.letter !== '') {

        // add letter to result
        result.push(worker.letter);

        // remove it from all pending letters parents
        for (dependentEntry of currentInput) {
          let parents = dependentEntry.parents.join('');
          parents = parents.replace(worker.letter, '');
          dependentEntry.parents = parents.split('');
        }

        worker.letter = '';
        worker.time = 0;
      }
      if (currentInput.length === 0) continue;

      // get first letter without deps
      const firstLetterWithoutDepsIndex = currentInput.findIndex(entry => entry.parents.length === 0);
      if (firstLetterWithoutDepsIndex < 0) continue;

      // remove it from "backlog"
      const currentEntry = currentInput.splice(firstLetterWithoutDepsIndex, 1)[0];
      // assign to worker
      worker.letter = currentEntry.letter;
      worker.time = globalTime + baseStepTime + currentEntry.letter.charCodeAt(0) - letterDiff;
    }
  }

  return globalTime - 1;
}
