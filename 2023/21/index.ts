import { lines, readFile } from '../utils';

const grid = lines(readFile('./input.txt')).map(
    (line) => line.split('') as C[]
);

type C = '.' | '#' | 'S';

interface P {
    x: number;
    y: number;
}

const draw = () => {
    const xOutput: string[] = [];

    for (let x = 0; x < grid[0].length; x++) {
        xOutput.push(x.toString().padStart(2, '0'));
    }

    console.log('   ' + xOutput.join(' '));

    for (let y = 0; y < grid.length; y++) {
        const output: string[] = [y.toString().padStart(2, '0') + ' '];
        for (let x = 0; x < grid[y].length; x++) {
            const c = s.has(`${x},${y}`)
                ? 'O'
                : grid[y][x] === 'S'
                ? 'S'
                : grid[y][x];

            output.push(' ', c, ' ');
        }

        console.log(output.join(''));
    }

    console.log();
};

const identify = (p: P): C | undefined => {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (x === p.x && y === p.y) {
                return grid[y][x];
            }
        }
    }

    return undefined;
};

let s = new Set(['0,0']);
let stepsRemaining = 64;

for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 'S') {
            s = new Set([`${x},${y}`]);
        }
    }
}

const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
];

const move = (p: P, d: P) => {
    const newP = { x: p.x + d.x, y: p.y + d.y };
    const tile = identify({ x: p.x + d.x, y: p.y + d.y });

    return {
        newP,
        success: tile === '.' || tile === 'S'
    };
};

while (stepsRemaining > 0) {
    const newPs = new Set<string>();

    for (const str of s) {
        const [x, y] = str.split(',').map(Number) as [number, number];

        for (const d of directions) {
            const { newP, success } = move({ x, y }, d);

            if (success) {
                newPs.add(`${newP.x},${newP.y}`);
            }
        }
    }

    s = newPs;

    // draw();
    stepsRemaining--;
}

console.log('part 1:', s.size);
