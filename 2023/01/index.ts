import { lines, readFile } from '../utils';

const input1 = readFile('./input.txt');

console.log(
    'part 1',
    lines(input1)
        .map((line) => line.replace(/[a-z]*/gi, ''))
        .map((line, _, arr) => parseInt(`${line[0]}${line[line.length - 1]}`))
        .reduce((a, b) => a + b, 0)
);

const input2 = readFile('./input.txt');
const numbers = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine'
];

console.log(
    'part 2',
    lines(input2).reduce((acc, line, i) => {
        const nums: number[] = [];

        line.split('').reduce((memo, char) => {
            const newChar = `${memo}${char}`;

            if (!isNaN(Number(char))) {
                nums.push(Number(char));

                return newChar.replace(new RegExp(`^${char}`), '');
            }

            const numStr = newChar.match(
                new RegExp(`${numbers.join('|')}`)
            )?.[0];

            if (numStr) {
                const index = numbers.indexOf(numStr);

                nums.push(index);

                return newChar.replace(
                    new RegExp(`${numStr}$`),
                    `${numStr[0]}${index}${numStr[numStr.length - 1]}`
                );
            }

            return newChar;
        }, '');

        const first = nums[0];
        const last = nums[nums.length - 1];

        const newInt = parseInt(`${first}${last}`);

        // console.log(i + 1, newInt, line);

        return acc + newInt;
    }, 0)
);
