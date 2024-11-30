import { lines, readFile } from '../utils';

const input1 = lines(readFile('./input-example.txt'));

const grid = input1.map((line) => line.split(''));

interface P {
    x: number;
    y: number;
    c: string;
    p?: P;
}

console.time('part 1');

const S = grid.reduce(
    (acc, row, y) => {
        const x = row.indexOf('S');

        if (x !== -1) {
            return { x, y, c: 'S' };
        }

        return acc;
    },
    { x: -1, y: -1, c: 'S' } as P
);

function move(p: P) {
    const points: P[] = [];

    // north
    let x = p.x;
    let y = Math.max(0, p.y - 1);
    let c = grid[y][x];

    if (c === '|' || c === '7' || c === 'F') {
        points.push({ x, y, c, p });
    }

    // east
    x = Math.min(p.x + 1, grid[y].length - 1);
    y = p.y;
    c = grid[y][x];

    if (c === '-' || c === '7' || c === 'J') {
        points.push({ x, y, c, p });
    }

    // south
    x = p.x;
    y = Math.min(p.y + 1, grid.length - 1);
    c = grid[y][x];

    if (c === '|' || c === 'L' || c === 'J') {
        points.push({ x, y, c, p });
    }

    // west
    x = Math.max(p.x - 1, 0);
    y = p.y;
    c = grid[y][x];

    if (c === '-' || c === 'L' || c === 'F') {
        points.push({ x, y, c, p });
    }

    return points.filter((p) => !hasVisited(p));
}

const all: P[] = [S];
const visited: Record<string, 1> = {};

const hasVisited = (p: P) => visited[`${p.x},${p.y}`];
let newItems: P[] = [];
let i = 0;

while (newItems.length > 0 || all.length === 1) {
    const unvisited = all.filter((p) => !hasVisited(p));

    const allIdentical =
        unvisited.length > 1 &&
        unvisited.every(
            (p) => p.x === unvisited[0].x && p.y === unvisited[0].y
        );

    if (allIdentical) {
        break;
    }

    newItems = unvisited.flatMap(move);

    all.push(...newItems);

    unvisited.forEach((p) => {
        visited[`${p.x},${p.y}`] = 1;
    });

    i++;
}

console.log(JSON.stringify(all.pop(), null, 2));

console.log('part 1:', i);
console.timeEnd('part 1');
