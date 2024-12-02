import { lines, readFile } from '../utils';

const input = lines(readFile('./input.txt')).map((line) =>
    line.split(' ').map(Number)
);

const splice = (array: number[], index: number) => {
    return array.filter((_, i) => index !== i);
};

const test = (numbers: number[]) => {
    let decTest = true;
    let incTest = true;

    for (let j = 0; j < numbers.length; j++) {
        const curr = numbers[j];
        const prev = numbers[j - 1];

        if (prev === undefined) {
            continue;
        }

        const diff = curr - prev;
        const absDiff = Math.abs(diff);
        const adjTest = absDiff === 0 || absDiff > 3;

        if (decTest && (diff > 0 || adjTest)) {
            decTest = false;
        }

        if (incTest && (diff < 0 || adjTest)) {
            incTest = false;
        }
    }

    return decTest || incTest;
};

console.time('part 1');
console.log(
    'part 1:',
    input.reduce((safe, numbers) => (test(numbers) ? safe + 1 : safe), 0)
);
console.timeEnd('part 1');

console.time('part 2');
console.log(
    'part 2:',
    input.reduce((safe, numbers) => {
        if (test(numbers)) {
            return safe + 1;
        }

        for (let i = 0; i < numbers.length; i++) {
            if (test(splice(numbers, i))) {
                return safe + 1;
            }
        }

        return safe;
    }, 0)
);
console.timeEnd('part 2');
