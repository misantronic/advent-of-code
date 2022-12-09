import { readFileSync } from 'fs';

const pwd = process.argv[1];
const input = readFileSync(`${pwd}/input.txt`, 'utf-8');

/** @param {string} char */
function getPrio(char) {
    const code = char.charCodeAt(0);

    if (char >= 'A' && char <= 'Z') {
        return code - 65 + 27;
    }

    if (char >= 'a' && char <= 'z') {
        return code - 96;
    }

    return 0;
}

const part1 = input.split('\n').reduce((sum, bag) => {
    const left = bag.substring(0, bag.length / 2);
    const right = bag.substring(bag.length / 2);

    const dupl = new Set(
        [...left].filter((char) => {
            return right.includes(char);
        })
    );

    return sum + [...dupl].reduce((prio, char) => prio + getPrio(char), 0);
}, 0);

console.log(part1);
