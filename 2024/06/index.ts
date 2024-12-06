import { lines, readFile } from '../utils';

const grid = lines(readFile('./input.txt')).map((line) => line.split(''));

interface G {
    x: number;
    y: number;
    d: '^' | 'v' | '<' | '>';
}

interface C {
    x: number;
    y: number;
    c: '.' | '#';
}

function draw(grid: string[][], visited: Set<string>) {
    for (let y = 0; y < grid.length; y++) {
        let line = '';
        for (let x = 0; x < grid[y].length; x++) {
            if (visited.has(`${x},${y}`)) {
                line += 'o';
            } else {
                line += grid[y][x];
            }
        }
        console.log(line);
    }
    console.log();
}

function findOx(g1: G, g2: G): C[] {
    const found: C[] = [];
    const start = (g1.x > g2.x ? g2.x : g1.x) + 1;
    const end = g1.x > g2.x ? g1.x : g2.x;

    for (let y = 0; y < grid.length; y++) {
        for (let x = start; x < end; x++) {
            if (grid[y][x] === '#') {
                found.push({
                    x: g1.d === '>' ? x + 1 : x - 1,
                    y: g1.y,
                    c: '#'
                });
            }
        }
    }

    return found;
}

function findOy(g1: G, g2: G): C[] {
    const found: C[] = [];
    const start = (g1.y > g2.y ? g2.y : g1.y) + 1;
    const end = g1.y > g2.y ? g1.y : g2.y;

    for (let y = start; y < end; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === '#') {
                if (Math.abs(g1.x - x) > 1) {
                    found.push({
                        x: g1.x,
                        y: g1.d === 'v' ? y + 1 : y - 1,
                        c: '#'
                    });
                }
            }
        }
    }

    return found;
}

function createLoop(c: C) {
    const gridCopy = grid.map((row, y) =>
        row.map((c2, x) => {
            return c.x === x && c.y === y ? '#' : c2;
        })
    );

    return loop(gridCopy);
}

function loop(grid: string[][]) {
    let g: G = { x: 0, y: 0, d: '^' };
    const visited: Set<string> = new Set();
    const dVisited: G[] = [];
    let dVisitedDoubled: string[] = [];

    // find starting point
    for (let y = 0; y < grid.length; y++) {
        const x = grid[y].indexOf(`^`);

        if (x !== -1) {
            g = { x, y, d: '^' };
            visited.add(`${x},${y}`);
            dVisited.push(g);
            grid[y][x] = '.';
            break;
        }
    }

    while (true) {
        const nextC = ((): C => {
            switch (g.d) {
                case '^':
                    return {
                        x: g.x,
                        y: g.y - 1,
                        c: grid[g.y - 1]?.[g.x] as C['c']
                    };
                case 'v':
                    return {
                        x: g.x,
                        y: g.y + 1,
                        c: grid[g.y + 1]?.[g.x] as C['c']
                    };
                case '<':
                    return {
                        x: g.x - 1,
                        y: g.y,
                        c: grid[g.y]?.[g.x - 1] as C['c']
                    };
                case '>':
                    return {
                        x: g.x + 1,
                        y: g.y,
                        c: grid[g.y]?.[g.x + 1] as C['c']
                    };
            }
        })();

        if (!nextC.c) {
            break;
        }

        const nextG = { ...g };

        switch (nextC.c) {
            case '#':
                if (dVisited.some((g) => g.x === nextG.x && g.y === nextG.y)) {
                    dVisitedDoubled.push(`${nextG.x},${nextG.y}`);

                    if (dVisitedDoubled.length === 100) {
                        return {
                            error: !dVisitedDoubled.every(
                                (x, i, arr) => x === arr[0]
                            ),
                            visited,
                            dVisited,
                            grid
                        };
                    }
                }

                dVisited.push(nextG);

                switch (g.d) {
                    case '^':
                        nextG.d = '>';
                        break;
                    case '>':
                        nextG.d = 'v';
                        break;
                    case 'v':
                        nextG.d = '<';
                        break;
                    case '<':
                        nextG.d = '^';
                        break;
                }
                break;
            case '.':
                nextG.x = nextC.x;
                nextG.y = nextC.y;
                break;
        }

        visited.add(`${nextG.x},${nextG.y}`);

        g = nextG;
    }

    return { error: false, visited, dVisited, grid };
}

const part1 = loop(grid.map((row) => [...row]));

console.log('part 1:', part1.visited.size);

// draw(part1.grid, new Set());

console.time('part 2');

const { dVisited, visited } = part1;
const loops = new Set<string>();

const lastVisited = Array.from(visited).pop();

const p2DVisited: G[] = [
    ...dVisited,
    {
        x: Number(lastVisited?.split(',')[0]),
        y: Number(lastVisited?.split(',')[1]),
        d: '^'
    }
];

for (let i = 0; i < p2DVisited.length; i++) {
    const g1 = p2DVisited[i];
    const g2 = p2DVisited[i + 1];

    if (!g2) {
        continue;
    }

    if (g1.y === g2.y) {
        // console.log('testing', g1, g2);
        for (const c of findOx(g1, g2)) {
            // console.log('found', c);

            const res = createLoop(c);

            if (res.error) {
                // draw(res.grid, res.visited);
                loops.add([...res.visited].join(''));
            }
        }
    }

    if (g1.x === g2.x) {
        // console.log('testing', g1, g2);
        for (const c of findOy(g1, g2)) {
            const res = createLoop(c);

            if (res.error) {
                // draw(res.grid, res.visited);
                loops.add([...res.visited].join(''));
            }
        }
    }
}

// draw(grid, [...loops][0]);

console.log('part 2', loops.size);
console.timeEnd('part 2');
