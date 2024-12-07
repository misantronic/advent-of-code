import { lines, readFile } from '../utils';

const input = lines(readFile('./input.txt')).map((line) => {
    const match = line.match(/^([RDLU]) (\d+) \((#[a-z0-9]+)\)$/);

    return {
        d: match?.[1]! as 'R' | 'D' | 'L' | 'U',
        n: Number(match?.[2]),
        hex: match?.[3]!
    };
});

interface P {
    x: number;
    y: number;
}

const boundaries = new Set<string>();
const space = new Set<string>();

let p: P = { x: 0, y: 0 };
let outer = 0;
let inner = 0;

input.forEach(({ d, n }) => {
    outer += n;

    for (let i = 0; i < n; i++) {
        const x = (() => {
            switch (d) {
                case 'R':
                    return p.x + 1;
                case 'L':
                    return p.x - 1;
                default:
                    return p.x;
            }
        })();

        const y = (() => {
            switch (d) {
                case 'D':
                    return p.y + 1;
                case 'U':
                    return p.y - 1;
                default:
                    return p.y;
            }
        })();

        boundaries.add(`${x},${y}`);

        p = { x, y };
    }
});

const minX = [...boundaries].reduce(
    (acc, p) => Math.min(acc, Number(p.split(',')[0])),
    Infinity
);
const maxX = [...boundaries].reduce(
    (acc, p) => Math.max(acc, Number(p.split(',')[0])),
    -Infinity
);
const minY = [...boundaries].reduce(
    (acc, p) => Math.min(acc, Number(p.split(',')[1])),
    Infinity
);
const maxY = [...boundaries].reduce(
    (acc, p) => Math.max(acc, Number(p.split(',')[1])),
    -Infinity
);

for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
        space.add(`${x},${y}`);
    }
}

const points = [...boundaries].map<P>((p) => {
    const [x, y] = p.split(',').map(Number);
    return { x, y };
});

function isPointInPolygon(point: P): boolean {
    const { x: px, y: py } = point;
    let inside = false;

    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const { x: xi, y: yi } = points[i];
        const { x: xj, y: yj } = points[j];

        const intersect =
            yi > py !== yj > py &&
            px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;

        if (intersect) {
            inside = !inside;
        }
    }

    return inside;
}

for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
        if (!boundaries.has(`${x},${y}`)) {
            const within = isPointInPolygon({ x, y });

            if (within) {
                inner++;
            }
        }
    }
}

console.log('part 1:', outer + inner);
