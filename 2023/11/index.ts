import { lines, readFile } from '../utils';

const input1 = lines(readFile('./input-example.txt'));
const grid = input1.map((line) => line.split(''));

console.time('part 1');

const columns: string[][] = [];
const emptyRows: number[] = [];
const emptyColumns: number[] = [];

for (let y = 0; y < grid.length; y++) {
    if (grid[y].every((cell) => cell === '.')) {
        emptyRows.push(y);
    }

    for (let x = 0; x < grid[y].length; x++) {
        const cell = grid[y][x];

        if (columns[x]) {
            columns[x].push(cell);
        } else {
            columns[x] = [cell];
        }
    }
}

columns.forEach((column, i) => {
    if (column.every((cell) => cell === '.')) {
        emptyColumns.push(i);
    }
});

interface P {
    x: number;
    y: number;
}

const expandedGrid: string[][] = grid
    .reduce((acc, row, y) => {
        if (emptyRows.includes(y)) {
            const fill = Array(row.length).fill('.') as string[];

            return [...acc, row, Array(1).fill(fill)];
        }

        return [...acc, row];
    }, [] as string[][])
    .reduce((acc: string[][], row: string[]) => {
        return [
            ...acc,
            row.reduce((acc2, column, x) => {
                if (emptyColumns.includes(x)) {
                    return [...acc2, column, ...Array(1).fill('.')];
                }

                return [...acc2, column];
            }, [] as string[])
        ];
    }, [] as string[][]);

const galaxies = expandedGrid.reduce((acc, row, y) => {
    return row.reduce((acc2, cell, x) => {
        if (cell === '#') {
            return [...acc2, { x, y }];
        }

        return acc2;
    }, acc);
}, [] as P[]);

function manhattanDistance(p1: P, p2: P): number {
    return Math.abs(p1.x - p2.x) + Math.abs(p2.y - p1.y);
}

function calculateShortestPaths(galaxies: P[]): number[][] {
    const distances: number[][] = [];

    for (let i = 0; i < galaxies.length; i++) {
        distances[i] = [];
        for (let j = 0; j < galaxies.length; j++) {
            if (i === j) {
                distances[i][j] = 0;
            } else {
                distances[i][j] = manhattanDistance(galaxies[i], galaxies[j]);
            }
        }
    }

    return distances;
}

const allPaths = calculateShortestPaths(galaxies);

console.log('');
console.log(
    'part 1:',
    allPaths.reduce((acc, paths, i) => {
        // console.log('galaxy', i + 1, paths);

        return paths.reduce((acc2, path, j) => {
            return acc2 + path;
        }, acc);
    }, 0) / 2
);
console.timeEnd('part 1');
