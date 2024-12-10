import { lines, readFile } from '../utils';

const grid = lines(readFile('./input.txt')).map((line) =>
    line.split('').map(Number)
);

interface P {
    x: number;
    y: number;
}

const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
];

const trailheads = grid.reduce((acc, row, y) => {
    row.forEach((value, x) => {
        if (value === 0) {
            acc.push({ x, y });
        }
    });
    return acc;
}, [] as P[]);

let score1 = 0;
let score2 = 0;

for (const trailhead of trailheads) {
    const paths = [[trailhead]];

    for (let height = 0; height < 9; height++) {
        const heightPaths = paths.filter((p, i) => i === height);
        const nextHeight = height + 1;

        for (const heightPath of heightPaths) {
            for (const p of heightPath) {
                for (const d of directions) {
                    const next = { x: p.x + d.x, y: p.y + d.y };

                    if (grid[next.y]?.[next.x] === nextHeight) {
                        paths[nextHeight] = [
                            ...(paths[nextHeight] ?? []),
                            next
                        ];
                    }
                }
            }
        }
    }

    const set = new Set<string>();
    const all = paths[paths.length - 1];

    for (const p of all) {
        set.add(`${p.x},${p.y}`);
    }

    score1 += set.size;
    score2 += all.length;
}

console.log('part 1', score1);
console.log('part 1', score2);
