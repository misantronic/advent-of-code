import { lines, readFile } from '../utils';

const input1 = lines(readFile('./input.txt'));

console.time('part 1');
console.log(
    'part 1:',
    input1.reduce((memo, line) => {
        let numbers = line.split(' ').map(Number);
        const result: number[][] = [numbers];

        while (!numbers.every((num) => num === 0)) {
            const newPatters: number[] = [];

            numbers.reduce((prev, num) => {
                if (prev === null) {
                    return num;
                }

                newPatters.push(num - prev);

                return num;
            }, null as number | null);

            numbers = newPatters;

            result.push(numbers);
        }

        const values = result.reduce(
            (acc, pattern) => {
                return [...acc, pattern[pattern.length - 1] + acc.at(-1)!];
            },
            [0]
        );

        return memo + values.at(-1)!;
    }, 0)
);
console.timeEnd('part 1');

console.time('part 2');
console.log(
    'part 2:',
    input1.reduce((memo, line) => {
        let numbers = line.split(' ').map(Number);
        const result: number[][] = [numbers];

        while (!numbers.every((num) => num === 0)) {
            const newPatters: number[] = [];

            numbers.reduce((prev, num) => {
                if (prev === null) {
                    return num;
                }

                newPatters.push(num - prev);

                return num;
            }, null as number | null);

            numbers = newPatters;

            result.push(numbers);
        }

        const values = result.reduceRight((acc, pattern) => {
            const firstPart = pattern[0] - (acc.at(0) ?? 0);

            return [firstPart, ...acc];
        }, []);

        return memo + values.at(0)!;
    }, 0)
);
console.timeEnd('part 2');
