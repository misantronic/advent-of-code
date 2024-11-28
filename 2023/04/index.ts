import { lines, readFile } from '../utils';

const input1 = lines(readFile('./input.txt'));

// Part 1

console.log(
    'part 1:',
    input1.reduce((sum, line) => {
        const [winningNumbers, yourNumbers] = line
            .split(' | ')
            .map((x) => x.replace(/Card\s+\d+: /, ''))
            .map((x) => x.split(' ').filter(Boolean).map(Number));

        return (
            sum +
            yourNumbers.reduce((acc, num) => {
                if (winningNumbers.includes(num)) {
                    if (acc === 0) {
                        return 1;
                    }

                    return acc * 2;
                }

                return acc;
            }, 0)
        );
    }, 0)
);

// Part 2
console.time('part 2');

function getNumbers(line: string) {
    return line
        .split(' | ')
        .map((x) => x.replace(/Card\s+\d+: /, ''))
        .map((x) => x.split(' ').filter(Boolean).map(Number));
}

const map = new Map<number, number>();

input1.forEach((line) => {
    let lines = [line];

    while (lines.length !== 0) {
        const newLines: string[] = [];

        lines.forEach((line) => {
            const cardNum = parseInt(line.match(/Card\s+(\d+)/)?.[1]!);
            const [winningNumbers, yourNumbers] = getNumbers(line);

            const wins = yourNumbers.reduce((acc, num) => {
                if (winningNumbers.includes(num)) {
                    return acc + 1;
                }

                return acc;
            }, 0);

            map.set(cardNum, (map.get(cardNum) ?? 0) + 1);

            if (wins > 0) {
                for (let i = cardNum; i < cardNum + wins; i++) {
                    if (input1[i]) {
                        newLines.push(input1[i]);
                    }
                }
            }
        });

        lines = newLines;
    }
});

let sum = 0;

for (const num of map.values()) {
    sum += num;
}

console.log('part 2:', sum);
console.timeEnd('part 2');
