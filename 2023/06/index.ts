import { lines, readFile } from '../utils';

const input1 = lines(readFile('./input.txt'));

const time = input1[0].match(/(\d+)/g)!.map(Number);
const distance = input1[1].match(/(\d+)/g)!.map(Number);

// part 1

console.log(
    'part 1:',
    time.reduce((res, t, i) => {
        const d = distance?.[i] ?? 0;
        let wins = 0;

        for (let i = 1; i <= t; i++) {
            const timeLeft = t - i;
            const travel = timeLeft * i;

            if (travel > d) {
                wins++;
            }
        }

        return res * wins;
    }, 1)
);

// part 2

const newTime = parseInt(time.reduce((acc, t) => `${acc}${t}`, ''));
const newDistance = parseInt(distance.reduce((acc, d) => `${acc}${d}`, ''));

console.log(
    'part 2:',
    (() => {
        const t = newTime;
        const d = newDistance;
        let wins = 0;

        for (let i = 1; i <= t; i++) {
            const timeLeft = t - i;
            const travel = timeLeft * i;

            // console.log(
            //     'charge:',
            //     i,
            //     'ms,',
            //     'time left:',
            //     timeLeft,
            //     'ms,',
            //     'travel:',
            //     travel,
            //     'mm/ms'
            // );

            if (travel > d) {
                wins++;
            }
        }

        return wins;
    })()
);
