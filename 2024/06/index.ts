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

                    // TODO: better check all the visited points
                    if (dVisitedDoubled.length === 5) {
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

console.time('part 2');

let loops = 0;

for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        const { error } = createLoop({ x, y, c: '#' });

        if (error) {
            loops++;
        }
    }
}

console.log('part 2', loops);
console.timeEnd('part 2');
