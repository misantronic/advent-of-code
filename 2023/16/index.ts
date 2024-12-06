import { lines, readFile } from '../utils';

const grid = lines(readFile('./input-example.txt')).map((line) =>
    line.split('')
) as C[][];

interface P {
    x: number;
    y: number;
    d: D;
}

type D = '→' | '←' | '↓' | '↑';
type C = '.' | '|' | '-' | '/' | '\\';

const beams: P[] = [{ x: 3, y: 0, d: '↓' }];

function getC(p: P) {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (x === p.x && y === p.y) {
                return grid[y][x];
            }
        }
    }

    throw new Error('Not found');
}

function getNextP(p: P, d: D): P | undefined {
    const p2 = ((): P => {
        switch (d) {
            case '→':
                return { ...p, d, x: p.x + 1 };
            case '←':
                return { ...p, d, x: p.x - 1 };
            case '↓':
                return { ...p, d, y: p.y + 1 };
            case '↑':
                return { ...p, d, y: p.y - 1 };
        }
    })();

    if (
        beams.some((b) => {
            return b.x === p2.x && b.y === p2.y && b.d === p2.d;
        })
    ) {
        return undefined;
    }

    if (p2.x < 0 || p2.y < 0 || p2.x >= grid[0].length || p2.y >= grid.length) {
        return undefined;
    }

    return p2;
}

function draw() {
    for (let y = 0; y < grid.length; y++) {
        console.log(
            grid[y]
                .map((c, x) => {
                    const b = beams.find((b) => b.x === x && b.y === y);
                    return b ? `[${c}${b.d}]` : '[  ]';
                })
                .join('')
        );
    }
}

console.time('part 1');

let i = 0;

while (true) {
    const next: (P | undefined)[] = [];

    for (let j = 0; j < beams.length; j++) {
        const beam = beams[j];

        switch (getC(beam)) {
            case '.':
                next.push(getNextP(beam, beam.d));
                break;
            case '-': {
                next.push(getNextP(beam, '→'), getNextP(beam, '←'));
                break;
            }
            case '|':
                next.push(getNextP(beam, '↑'), getNextP(beam, '↓'));
                break;
            case '/':
                switch (beam.d) {
                    case '→': {
                        next.push(getNextP(beam, '↑'));
                        break;
                    }
                    case '←': {
                        next.push(getNextP(beam, '↓'));
                        break;
                    }
                    case '↓': {
                        next.push(getNextP(beam, '←'));
                        break;
                    }
                    case '↑': {
                        next.push(getNextP(beam, '→'));
                        break;
                    }
                }
                break;
            case '\\':
                switch (beam.d) {
                    case '→': {
                        next.push(getNextP(beam, '↓'));
                        break;
                    }
                    case '←': {
                        next.push(getNextP(beam, '↑'));
                        break;
                    }
                    case '↓': {
                        next.push(getNextP(beam, '→'));
                        break;
                    }
                    case '↑': {
                        next.push(getNextP(beam, '←'));
                        break;
                    }
                }
                break;
        }
    }

    const fNext = next.filter((p): p is P => {
        return Boolean(p);
    });

    if (fNext.length === 0) {
        break;
    }

    beams.push(...fNext);

    i++;
}

console.log(
    'part 1',
    beams.reduce((acc, b) => {
        acc.add(`${b.x},${b.y}`);

        return acc;
    }, new Set<string>()).size
);
console.timeEnd('part 1');
draw();
