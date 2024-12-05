import { lines, readFile } from '../utils';

const table = readFile('./input.txt').split(',');

const hash = (str: string) => {
    return str.split('').reduce((prev, c) => {
        let value = prev;

        value += c.charCodeAt(0);
        value *= 17;
        value %= 256;

        return value;
    }, 0);
};

console.log(
    'part 1:',
    table.map(hash).reduce((a, b) => a + b, 0)
);

const boxes = Array(256)
    .fill(null)
    .map(() => new Map<string, number>());

table.map((str) => {
    const [, label, cmd, value] = str.match(/^(\w+)([=-])(\d*)/) || [];

    const hashed = hash(label);

    if (cmd === '=') {
        boxes[hashed].set(label, +value);
    }

    if (cmd === '-') {
        boxes[hashed].delete(label);
    }
});

console.log(
    'part 2:',
    boxes.reduce((sum, box, i) => {
        let slot = 1;

        for (const value of box.values()) {
            sum += (i + 1) * slot * value;
            slot++;
        }

        return sum;
    }, 0)
);
