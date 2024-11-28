import { lines, readFile } from '../utils';

const input1 = lines(readFile('./input.txt'));

type Color = 'red' | 'green' | 'blue';

const limits = new Map<Color, number>([
    ['red', 12],
    ['green', 13],
    ['blue', 14]
]);

console.log(
    'part 1:',
    input1.reduce((acc, line) => {
        const id = parseInt(line.match(/Game (\d+)/)?.[1]!);

        let valid = true;

        line.replace(/Game \d+: /, '')
            .split(';')
            .map((round) => {
                round
                    .split(',')
                    .map((draw) => draw.trim())
                    .forEach((draw) => {
                        const parts = draw.split(' ');
                        const num = parseInt(parts[0]);
                        const color = parts[1] as Color;

                        if (num > limits.get(color)!) {
                            valid = false;
                        }
                    });
            });

        if (valid) {
            return acc + id;
        }

        return acc;
    }, 0)
);

console.log(
    'part 2:',
    input1.reduce((acc, line) => {
        const id = parseInt(line.match(/Game (\d+)/)?.[1]!);

        const colors = new Map<Color, number>();

        line.replace(/Game \d+: /, '')
            .split(';')
            .map((round) => {
                round
                    .split(',')
                    .map((draw) => draw.trim())
                    .forEach((draw) => {
                        const parts = draw.split(' ');
                        const num = parseInt(parts[0]);
                        const color = parts[1] as Color;

                        colors.set(
                            color,
                            Math.max(colors.get(color) ?? 0, num)
                        );
                    });
            });

        const power = [...colors.values()].reduce((acc, val) => acc * val, 1);

        return acc + power;
    }, 0)
);
