import { lines, readFile } from '../utils';

const input1 = readFile('./input.txt');
const input2 = readFile('./input.txt');

console.log(
    'part 1:',
    [...input1.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)].reduce((acc, match) => {
        const [_, a, b] = match;

        return acc + Number(a) * Number(b);
    }, 0)
);

let enabled = true;

console.log(
    'part 2:',
    [...input2.matchAll(/do\(\)|don't\(\)|mul\((\d{1,3}),(\d{1,3})\)/g)].reduce(
        (acc, match) => {
            const cmd = match[0] as 'do()' | "don't()" | (string & {});

            if (cmd === "don't()") {
                enabled = false;
            }

            if (cmd === 'do()') {
                enabled = true;
            }

            if (enabled && cmd.startsWith('mul')) {
                const [_, a, b] = match;

                return acc + Number(a) * Number(b);
            }

            return acc;
        },
        0
    )
);
