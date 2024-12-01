import { lines, readFile } from '../utils';

const input1 = lines(readFile('./input.txt'));

const lists = input1.map(
    (line) =>
        line
            .match(/(\d+)\s+(\d+)/)
            ?.map(Number)
            .filter(Boolean) ?? []
);

const left = lists.map((list) => list[0]).sort((a, b) => a - b);
const right = lists.map((list) => list[1]).sort((a, b) => a - b);

console.time('part 1');
console.log(
    'part 1:',
    left.reduce((acc, curr, i) => acc + Math.abs(right[i] - curr), 0)
);
console.timeEnd('part 1');

console.time('part 2');
console.log(
    'part 2:',
    left.reduce((acc, l, i) => {
        const occ = right.filter((r) => r === l).length;

        return acc + l * occ;
    }, 0)
);
console.timeEnd('part 2');
