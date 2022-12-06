import { readFileSync } from 'fs';

const pwd = process.argv[1];
const input = readFileSync(`${pwd}/input.txt`, 'utf-8');

function findMarker(num) {
    for (let i = 0; i < input.length; i++) {
        const chars = new Set();

        new Array(num).fill(null).forEach((_, j) => chars.add(input[i + j]));

        if (chars.size === num) {
            console.log(i + num);
            break;
        }
    }
}

// part 1
findMarker(4);

// part 2
findMarker(14);
