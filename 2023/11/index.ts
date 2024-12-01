import { lines, readFile } from '../utils';

const input1 = lines(readFile('./input.txt'));
const grid = input1.map((line) => line.split(''));

console.time('part 2');

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

let expandFactor = 1_000_000;

const galaxies: P[] = [];
for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === '#') {
            galaxies.push({
                x:
                    x +
                    emptyColumns.filter((col) => col < x).length *
                        (expandFactor - 1),
                y:
                    y +
                    emptyRows.filter((row) => row < y).length *
                        (expandFactor - 1)
            });
        }
    }
}

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
    'part 2:',
    allPaths.reduce((acc, paths, i) => {
        // console.log('galaxy', i + 1, paths);

        return paths.reduce((acc2, path, j) => {
            return acc2 + path;
        }, acc);
    }, 0) / 2
);
console.timeEnd('part 2');
