import { lines, readFile } from '../utils';

const input = lines(readFile('input.txt'));

interface Point {
    x: number;
    y: number;
    direction?: Direction;
}

interface Propose {
    elve: Point;
    propose: Point;
}

type Direction = 'N' | 'NE' | 'NW' | 'S' | 'SE' | 'SW' | 'W' | 'E';

const elves = input.reduce((memo, line, y) => {
    const chars = line.split('');

    chars.forEach((char, x) => {
        if (char === '#') {
            memo.push({ x, y });
        }
    });

    return memo;
}, [] as Point[]);

const directions: Direction[] = ['N', 'S', 'W', 'E'];

const directionmatrix: {
    [key in Direction]: Direction[];
} = {
    N: ['N', 'NE', 'NW'],
    S: ['S', 'SE', 'SW'],
    W: ['W', 'NW', 'SW'],
    E: ['E', 'NE', 'SE'],

    NE: [],
    NW: [],
    SE: [],
    SW: []
};

console.log('initial');
draw(elves);

function equal(a?: Point, b?: Point) {
    return a?.x === b?.x && a?.y === b?.y;
}

function getNeighbors(elves: Point[], elve: Point) {
    const neighbors: Point[] = [
        { x: elve.x, y: elve.y - 1, direction: 'N' },
        { x: elve.x, y: elve.y + 1, direction: 'S' },
        { x: elve.x - 1, y: elve.y, direction: 'W' },
        { x: elve.x + 1, y: elve.y, direction: 'E' },
        { x: elve.x + 1, y: elve.y - 1, direction: 'NE' },
        { x: elve.x - 1, y: elve.y - 1, direction: 'NW' },
        { x: elve.x + 1, y: elve.y + 1, direction: 'SE' },
        { x: elve.x - 1, y: elve.y + 1, direction: 'SW' }
    ];

    return neighbors.filter((e1) => elves.some((e2) => equal(e1, e2)));
}

function moveAround(elves: Point[]) {
    const proposes = elves
        .map<Propose | undefined>((elve) => {
            const neighbors = getNeighbors(elves, elve);

            if (neighbors.length === 0) {
                return undefined;
            }

            const points: {
                [key in Direction]: Point;
            } = {
                N: { x: elve.x, y: elve.y - 1, direction: 'N' },
                S: { x: elve.x, y: elve.y + 1, direction: 'S' },
                W: { x: elve.x - 1, y: elve.y, direction: 'W' },
                E: { x: elve.x + 1, y: elve.y, direction: 'E' },
                NE: { x: 0, y: 0 },
                NW: { x: 0, y: 0 },
                SE: { x: 0, y: 0 },
                SW: { x: 0, y: 0 }
            };

            for (const directionInQueue of directions) {
                if (
                    neighbors.filter(({ direction }) => {
                        return directionmatrix[directionInQueue].includes(
                            direction!
                        );
                    }).length === 0
                ) {
                    return { elve, propose: points[directionInQueue] };
                }
            }

            return undefined;
        })
        .filter((elve, _, arr) => {
            if (!elve) {
                return false;
            }

            return (
                arr.filter((e) => equal(e?.propose, elve?.propose)).length <= 1
            );
        }) as Propose[];

    directions.push(directions.shift()!);

    if (proposes.length === 0) {
        return undefined;
    }

    return elves
        .map((elve) => proposes.find((e) => e.elve === elve)?.propose ?? elve)
        .map<Point>(({ x, y }) => ({ x, y }))
        .sort((a, b) => a.y * 1000 + a.x - (b.y * 1000 + b.x));
}

function draw(elves: Point[]) {
    const minX = elves.reduce((memo, p) => Math.min(memo, p.x), Infinity);
    const maxX = elves.reduce((memo, p) => Math.max(memo, p.x), 0);
    const minY = elves.reduce((memo, p) => Math.min(memo, p.y), Infinity);
    const maxY = elves.reduce((memo, p) => Math.max(memo, p.y), 0);

    const output: string[] = [];

    for (let y = minY; y <= maxY; y++) {
        const line: string[] = [`${y.toString().padStart(2, '0')} `];

        for (let x = minX; x <= maxX; x++) {
            const char = (() => {
                if (elves.some((e) => equal(e, { x, y }))) {
                    return '#';
                }

                return '.';
            })();

            line.push(char);
        }

        output.push(line.join(''));
    }

    console.log('');
    console.log(output.join('\n'));
    console.log('');
}

let movingElves: Point[] | undefined = elves;
let round = 1;

while (movingElves) {
    console.log('round', round);

    const elves = moveAround(movingElves);

    if (!elves) {
        draw(movingElves);
        break;
    }

    // console.log(elves);
    // draw(elves);

    movingElves = elves;

    // if (round === 10) {
    //     break;
    // }

    round++;
}

const elveMinX = movingElves.reduce((memo, p) => Math.min(memo, p.x), Infinity);
const elveMaxX = movingElves.reduce((memo, p) => Math.max(memo, p.x), 0);
const elveMinY = movingElves.reduce((memo, p) => Math.min(memo, p.y), Infinity);
const elveMaxY = movingElves.reduce((memo, p) => Math.max(memo, p.y), 0);

const maxTiles = (elveMaxX - elveMinX + 1) * (elveMaxY - elveMinY + 1);
const emptyTiles = maxTiles - movingElves.length;

console.log({
    maxTiles,
    emptyTiles
});
