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

function createLoop(c?: C) {
    const gridCopy = grid.map((row, y) =>
        row.map((c2, x) => {
            return c?.x === x && c?.y === y ? '#' : c2;
        })
    );

    return loop(gridCopy);
}

function loop(grid: string[][]) {
    let g: G = { x: -1, y: -1, d: '^' };
    const visited: Set<string> = new Set();
    const gVisited: G[] = [];

    const numO = grid.flat().filter((c) => c === '#').length;

    // find starting point
    for (let y = 0; y < grid.length; y++) {
        const x = grid[y].indexOf(`^`);

        if (x !== -1) {
            g = { x, y, d: '^' };
            visited.add(`${x},${y}`);
            gVisited.push(g);
            grid[y][x] = '.';
            break;
        }
    }

    while (true) {
        // not quite sure how to detect a loop
        if (gVisited.length >= numO * 2) {
            return { loop: true, visited, grid };
        }

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
            // out of bounds
            return { loop: false, visited, grid };
        }

        const nextG = { ...g };

        if (nextC.c === '.') {
            nextG.x = nextC.x;
            nextG.y = nextC.y;
        }

        if (nextC.c === '#') {
            gVisited.push(nextG);

            if (g.d === '^') {
                nextG.d = '>';
            } else if (g.d === '>') {
                nextG.d = 'v';
            } else if (g.d === 'v') {
                nextG.d = '<';
            } else if (g.d === '<') {
                nextG.d = '^';
            }
        }

        visited.add(`${nextG.x},${nextG.y}`);

        g = nextG;
    }
}

const { visited } = createLoop();

console.log('part 1:', visited.size);

console.time('part 2');

let loops = 0;

for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        if (visited.has(`${x},${y}`)) {
            const { loop } = createLoop({ x, y, c: '#' });

            if (loop) {
                loops++;
            }
        }
    }
}

console.log('part 2', loops);
console.timeEnd('part 2');
