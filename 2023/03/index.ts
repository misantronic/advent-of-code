import { lines, readFile } from '../utils';

const input1 = lines(readFile('./input.txt'));

const grid = input1.map((line) => {
    return [...line.split(''), '.'];
});

// Part 1

console.log(
    'part 1:',
    grid.reduce((sum, rows, y) => {
        // if (y !== 1) {
        //     return sum;
        // }

        rows.reduce((numStr, char, x) => {
            if (/^\d+$/.test(numStr + char)) {
                return numStr + char;
            }

            if (numStr) {
                const num = parseInt(numStr);
                const xStart = x - numStr.length;
                const xEnd = x - 1;
                const range = {
                    x1: Math.max(0, xStart - 1),
                    y1: Math.max(y - 1, 0),
                    x2: xEnd + 1,
                    y2: y + 1
                };

                let valid = false;

                for (let y2 = range.y1; y2 <= range.y2; y2++) {
                    for (let x2 = range.x1; x2 <= range.x2; x2++) {
                        if (grid[y2]?.[x2] && /[^0-9.]/.test(grid[y2][x2])) {
                            valid = true;
                            break;
                        }
                    }
                }

                if (valid) {
                    sum += num;
                }
            }

            return '';
        }, '');

        return sum;
    }, 0)
);

// Part 2

const map = new Map<string, number[]>();

grid.reduce((sum, rows, y) => {
    rows.reduce((numStr, char, x) => {
        if (/^\d+$/.test(numStr + char)) {
            return numStr + char;
        }

        if (numStr) {
            const num = parseInt(numStr);
            const xStart = x - numStr.length;
            const xEnd = x - 1;
            const range = {
                x1: Math.max(0, xStart - 1),
                y1: Math.max(y - 1, 0),
                x2: xEnd + 1,
                y2: y + 1
            };

            for (let y2 = range.y1; y2 <= range.y2; y2++) {
                for (let x2 = range.x1; x2 <= range.x2; x2++) {
                    if (grid[y2]?.[x2] && /[*]/.test(grid[y2][x2])) {
                        const key = `${x2},${y2}`;

                        if (map.has(key)) {
                            map.get(key)!.push(num);
                        } else {
                            map.set(key, [num]);
                        }
                        break;
                    }
                }
            }
        }

        return '';
    }, '');

    return sum;
}, 0);

let sum = 0;

for (const [_, [a, b]] of map) {
    if (a && b) {
        sum += a * b;
    }
}

console.log('part 2:', sum);
