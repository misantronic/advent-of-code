import { lines, readFile } from '../utils';

interface Point {
    x: number;
    y: number;
    rock?: boolean;
    sand?: boolean;
}

const input = lines(readFile('input-example.txt'));

function equal(a?: Point, b?: Point) {
    return a?.x === b?.x && a?.y === b?.y;
}

function findPoint(flatGrid: Point[], point: Point) {
    for (const element of flatGrid) {
        if (equal(element, point)) {
            return element;
        }
    }

    return undefined;
}

const rockLines = input.map((line) => {
    return line.split(' -> ').map<Point>((coord) => {
        const [x, y] = coord.split(',').map(Number);

        return { x, y, rock: true };
    });
});

const sandStart: Point = { x: 500, y: 0 };

function draw(grid: Point[][]) {
    const output: string[] = [];

    for (let y = 0; y < grid.length; y++) {
        const gridLine = grid[y];
        const line: string[] = [`${`${y}`.padStart(3, '0')} `];

        for (let x = 0; x < gridLine.length; x++) {
            const char = (() => {
                if (
                    gridLine[x].x === sandStart.x &&
                    gridLine[x].y === sandStart.y
                ) {
                    return '+';
                }

                if (gridLine[x].rock) {
                    return '#';
                }

                if (gridLine[x].sand) {
                    return 'o';
                }

                return '.';
            })();

            line.push(char);
        }

        output.push(line.join(''));
    }

    console.log(output.join('\n'), '\n');
}

function applySandGravity(grid: Point[], sandPoint: Point): Point | undefined {
    sandPoint.sand = true;

    const down = findPoint(grid, { x: sandPoint.x, y: sandPoint.y + 1 });

    if (down && !down.rock && !down.sand) {
        sandPoint.sand = false;
        down.sand = true;

        return applySandGravity(grid, down);
    }

    // look diagonally left
    const diagLeft = findPoint(grid, {
        x: sandPoint.x - 1,
        y: sandPoint.y + 1
    });

    if (!diagLeft) {
        sandPoint.sand = false;
        return undefined;
    }

    if (diagLeft && !diagLeft.rock && !diagLeft.sand) {
        sandPoint.sand = false;
        diagLeft.sand = true;

        return applySandGravity(grid, diagLeft);
    }

    // look diagonally right
    const diagRight = findPoint(grid, {
        x: sandPoint.x + 1,
        y: sandPoint.y + 1
    });

    if (!diagRight) {
        sandPoint.sand = false;
        return undefined;
    }

    if (diagRight && !diagRight.rock && !diagRight.sand) {
        sandPoint.sand = false;
        diagRight.sand = true;

        return applySandGravity(grid, diagRight);
    }

    return sandPoint;
}

function part1() {
    const { min, max } = Math;
    const rocks = rockLines.flat();

    const maxX = rocks.reduce((x, rock) => max(x, rock.x), 0);
    const minX = rocks.reduce((x, rock) => min(x, rock.x), maxX);
    const maxY = rocks.reduce((y, rock) => max(y, rock.y), 0);

    const grid: Point[][] = [];

    for (let y = 0; y <= maxY; y++) {
        grid[y] = [];

        for (let x = minX; x <= maxX; x++) {
            const p: Point = { x, y };

            rockLines.forEach((rocks) => {
                rocks.reduce((prevRock, rock) => {
                    if (
                        p.x >= prevRock.x &&
                        p.x <= rock.x &&
                        p.y >= prevRock.y &&
                        p.y <= rock.y
                    ) {
                        p.rock = true;
                    }

                    if (
                        p.x <= prevRock.x &&
                        p.x >= rock.x &&
                        p.y <= prevRock.y &&
                        p.y >= rock.y
                    ) {
                        p.rock = true;
                    }

                    return rock;
                }, rocks[0]);
            });

            grid[y].push(p);
        }
    }

    const flatGrid: Point[] = grid.reduce((memo, arr) => [...memo, ...arr], []);

    let sandY = 0;

    while (true) {
        const sandPoint = findPoint(flatGrid, { x: sandStart.x, y: sandY })!;

        if (!sandPoint.rock && !sandPoint.sand) {
            sandY++;
            continue;
        }

        const sandTarget = { ...sandStart, y: sandY - 1 };

        const point = findPoint(flatGrid, sandTarget)!;
        const newPoint = applySandGravity(flatGrid, point);

        if (newPoint === undefined) {
            break;
        }

        sandY =
            flatGrid.reduce(
                (minY, p) => (p.sand ? Math.min(p.y, minY) : minY),
                maxY
            ) - 1;

        draw(grid);
    }

    return flatGrid.filter((p) => p.sand).length;
}

console.log('part 1:', part1());
