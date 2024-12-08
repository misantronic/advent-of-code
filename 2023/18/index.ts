import { lines, readFile } from '../utils';

const input = lines(readFile('./input-example.txt')).map((line) => {
    const match = line.match(/^([RDLU]) (\d+) \((#[a-z0-9]+)\)$/);
    const rawHex = match?.[3]!;
    const hex = rawHex.substring(1, 6)!;
    const d = ((): 'R' | 'D' | 'L' | 'U' => {
        const id = rawHex.substring(rawHex.length - 1);

        if (id === '0') {
            return 'R';
        } else if (id === '1') {
            return 'D';
        } else if (id === '2') {
            return 'L';
        } else {
            return 'U';
        }
    })();

    return {
        d,
        n: hexToNumber(hex)
    };
});

function hexToNumber(hex: string): number {
    return parseInt(hex, 16);
}

interface P {
    x: number;
    y: number;
}

const boundaries = new Set<string>();

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

const points = [...boundaries].map<P>((p) => {
    const [x, y] = p.split(',').map(Number);
    return { x, y };
});

// @see https://de.wikipedia.org/wiki/Gau%C3%9Fsche_Trapezformel
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
