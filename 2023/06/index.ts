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

        for (let x = 1; x <= t; x++) {
            const travel = (t - x) * x;

            if (travel > d) {
                wins++;
            }
        }

        return res * wins;
    }, 1)
);

// part 2

const t = parseInt(time.join(''));
const d = parseInt(distance.join(''));

console.log(
    'part 2:',
    (() => {
        const x = Math.ceil((t - Math.sqrt(t * t - 4 * d)) / 2);

        return t + 1 - 2 * x;
    })()
);
