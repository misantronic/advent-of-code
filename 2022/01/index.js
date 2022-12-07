import { readFileSync } from 'fs';

const pwd = process.argv[1];
const input = readFileSync(`${pwd}/input.txt`, 'utf-8');

const [top1, top2, top3] = input
    .split('\n\n')
    .map((str) => {
        return str.split('\n').reduce((memo, cal) => memo + parseInt(cal), 0);
    })
    .sort()
    .reverse();

// part 1
console.log(top1);

// part 2
console.log(top1 + top2 + top3);
