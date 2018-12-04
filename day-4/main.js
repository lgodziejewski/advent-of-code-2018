const { fileToArray } = require('../fileToArray');
const dir = __dirname;

fileToArray(dir, 'input').then(input => {
    const parsedInput = parseInput(input);

    const firstResult = calculateFirstTask(parsedInput);
    console.log('first result: ', firstResult);

    const secondResult = calculateSecondTask(parsedInput);
    console.log('second result: ', secondResult);
});

const TIME_RE = /\[(.*)\] (.*)$/;
const GUARD_RE = /\#(\d+) begins/;
function parseInput(input) {
    const parsed = input.map(entry => {
        const [_, timestamp, event] = TIME_RE.exec(entry);
        
        return {
            timestamp,
            event,
        };
    });

    // todo sort by time
    parsed.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);

    // split by guard
    let guardId;
    const split = parsed.reduce((acc, entry) => {
        if (entry.event.includes('Guard')) {
            const [_, id] = GUARD_RE.exec(entry.event);
            guardId = +id;
            if (!acc[guardId]) acc[guardId] = [];
        } else {
            acc[guardId].push(entry);
        }

        return acc;
    }, {});

    // count which minute which guard was asleep
    /* desired output:
    guardId: {
        0: <total time asleep>
        1: <total time asleep>
        ...
        59: <total time asleep>
    },
    [...]
    */
    const guardMinutesAsleep = {};
    Object.keys(split).forEach(guardId => {
        const entries = split[guardId];
        // initialize result dict
        const currentGuard = {};
        guardMinutesAsleep[guardId] = currentGuard;
        for (let i = 0; i < 60; i++) {
            currentGuard[i] = 0;
        }

        let asleep = false;
        let prevMinute = 0;
        entries.forEach(entry => {
            const currentMinute = +entry.timestamp.slice(-2);
            asleep = !asleep;

            // increment all entries in range [prevMinute, currentMinute) when wakes up
            if (!asleep) {
                for (let i = prevMinute; i < currentMinute; i++) {
                    currentGuard[i]++;
                }
            }

            // set new prevMinute
            prevMinute = currentMinute;
        });
    });

    return guardMinutesAsleep;
}

function calculateFirstTask(input) {
    // count total time
    const guardResults = Object.keys(input).reduce((acc, guardId) => {
        const minutes = input[guardId];
        acc[guardId] = {
            total: Object.keys(minutes).reduce((acc, entry) => acc + +minutes[entry], 0),
            minutes,
        }

        return acc;
    }, {});

    // find guard with highest total
    const mostAsleepGuard = {
        guardId: 0,
        total: 0,
    };
    Object.keys(guardResults).forEach(guardId => {
        if (guardResults[guardId].total > mostAsleepGuard.total) {
            mostAsleepGuard.total = guardResults[guardId].total;
            mostAsleepGuard.guardId = guardId;
        }
    });

    // find most asleep guard's most asleep minute
    const mostAsleepMinute = {
        minute: 0,
        value: 0,
    };
    const guardMinutes = guardResults[mostAsleepGuard.guardId].minutes;
    Object.keys(guardMinutes).forEach(minute => {
        if (guardMinutes[minute] > mostAsleepMinute.value) {
            mostAsleepMinute.minute = minute;
            mostAsleepMinute.value = guardMinutes[minute];
        }
    })

    const res = {
         guardId: mostAsleepGuard.guardId,
         minute: mostAsleepMinute.minute,
    };

    return res.guardId * res.minute;
}

function calculateSecondTask(input) {
    // find max minute value

    const current = {
        max: 0,
        guardId: 0,
        minute: 0,
    };
    Object.keys(input).forEach(guardId => {
        const minutes = input[guardId];

        Object.keys(minutes).forEach(minute => {
            if (minutes[minute] > current.max) {
                current.max = minutes[minute];
                current.guardId = +guardId;
                current.minute = +minute;
            }
        })
    });

    return current.guardId * current.minute;
}