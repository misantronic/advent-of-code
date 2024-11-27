import { lines, readFile } from '../utils';

const input = lines(readFile('input-example.txt'));

type Char = '#' | '.' | '>' | 'v' | '^' | '<' | 'E';

interface Point {
    x: number;
    y: number;
    chars: Set<Char>;
}

type RawPoint = Omit<Point, 'chars'>;

const grid: Point[] = [];

input.map((line, y) => {
    line.split('').map((char, x) => {
        grid.push({ x, y, chars: new Set([char as Char]) });
    });
});

// reset E
find({ x: 1, y: 0 })!.chars = new Set(['E']);

const maxX = grid.reduce((a, b) => Math.max(a, b.x), 0);
const maxY = grid.reduce((a, b) => Math.max(a, b.y), 0);

function hasBlizzard(p: Point) {
    return (
        p.chars.has('<') ||
        p.chars.has('>') ||
        p.chars.has('v') ||
        p.chars.has('^')
    );
}

function isWall(p: Point) {
    return find(p)?.chars.has('#');
}

function isVoid(p: RawPoint) {
    return find(p) === undefined;
}

function equal(a?: RawPoint, b?: RawPoint) {
    return a?.x === b?.x && a?.y === b?.y;
}

function find(p: RawPoint) {
    return grid.find((point) => equal(point, p));
}

function findE() {
    return grid.find((p) => p.chars.has('E'))!;
}

function getNeighbors(point: Point) {
    return grid
        .filter((p) => {
            return (
                equal(point, { x: p.x - 1, y: p.y }) ||
                equal(point, { x: p.x + 1, y: p.y }) ||
                equal(point, { x: p.x, y: p.y - 1 }) ||
                equal(point, { x: p.x, y: p.y + 1 })
            );
        })
        .filter((p) => p.chars.has('.'));
}

function switchE(point: Point) {
    const E = findE();

    E.chars.delete('E');

    if (E.chars.size === 0) {
        E.chars.add('.');
    }

    point.chars.delete('.');
    point.chars.add('E');
}

function nextTiles(p: Point): Point[] {
    if (!hasBlizzard(p)) {
        return [];
    }

    return [...p.chars].map((char) => {
        const tile = ((): Point => {
            const chars = new Set([char]);

            switch (char) {
                case '<':
                    return { x: p.x - 1, y: p.y, chars };
                case '>':
                    return { x: p.x + 1, y: p.y, chars };
                case 'v':
                    return { x: p.x, y: p.y + 1, chars };
                case '^':
                    return { x: p.x, y: p.y - 1, chars };
                default:
                    return p;
            }
        })();

        if (isVoid(tile)) {
            switch (char) {
                case 'v':
                    return { ...tile, y: 1 };
                case '^':
                    return { ...tile, y: maxY - 1 };
            }
        }

        if (isWall(tile)) {
            switch (char) {
                case '<':
                    return { ...tile, x: maxX - 1 };
                case '>':
                    return { ...tile, x: 1 };
                case 'v':
                    return { ...tile, y: p.x === 1 ? 0 : 1 };
                case '^':
                    return { ...tile, y: p.x === maxX - 1 ? maxY : maxY - 1 };
                default:
                    return p;
            }
        }

        return tile;
    });
}

function draw() {
    const output: string[] = [];

    for (let y = 0; y <= maxY; y++) {
        const line: string[] = [`${y.toString().padStart(2, '0')} `];

        for (let x = 0; x <= maxX; x++) {
            const el = find({ x, y })!;

            line.push(
                el.chars.size > 1 ? String(el.chars.size) : [...el.chars][0]
            );
        }

        output.push(line.join(''));
    }

    console.log('');
    console.log(output.join('\n'));
    console.log('');
}

const visited: Point[] = [];

function bfs(start: Point, goal: Point) {
    const queue = [start];

    visited.push(start);

    while (queue.length) {
        const element = queue.pop()!;

        if (equal(element, goal)) {
            return true;
        }

        for (const neighbor of getNeighbors(element)) {
            if (!visited.includes(neighbor)) {
                queue.push(neighbor);
                visited.push(neighbor);
            }
        }
    }

    return false;
}

console.log('initial');
draw();

let i = 0;

while (true) {
    grid.filter(hasBlizzard)
        .map((blizzard) => {
            const tiles = nextTiles(blizzard);

            blizzard.chars = new Set(['.']);

            return tiles;
        })
        .forEach((nextTiles) => {
            nextTiles.forEach((nextTile) => {
                const gridPoint = find(nextTile);

                if (gridPoint) {
                    gridPoint.chars.delete('.');

                    for (const char of nextTile.chars) {
                        gridPoint.chars.add(char);
                    }
                }
            });
        });

    console.log(bfs(findE(), find({ x: maxX - 1, y: maxY - 1 })!));

    console.log('minute', i + 1);
    draw();

    i++;

    if (i == 5) {
        break;
    }
}

// console.log(grid);
