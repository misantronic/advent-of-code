import { lines, readFile } from '../utils';

const [rawGrid, rawMoves] = readFile('./input-example.txt').split('\n\n');

const grid = lines(rawGrid).map((line) => line.split(''));
let moves = rawMoves.split('\n').flatMap((line) => line.split('') as D[]);

type D = '<' | '>' | '^' | 'v';

interface P {
    x: number;
    y: number;
    c?: string;
}

const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
];

const mapDirection = (d: D) => {
    switch (d) {
        case '^':
            return directions[0];
        case '>':
            return directions[1];
        case 'v':
            return directions[2];
        case '<':
            return directions[3];
    }
};

let drawDelay = 0;

function draw(grid: string[][]) {
    drawDelay += 32;

    const copyGrid = grid.map((line) => [...line]);

    setTimeout(() => {
        for (let y = 0; y < copyGrid.length; y++) {
            process.stdout.write('\x1b[1A'); // Move the cursor up by one line
            process.stdout.write('\x1b[2K'); // Clear the line
        }

        for (let y = 0; y < copyGrid.length; y++) {
            console.log(copyGrid[y].join(''));
        }
    }, drawDelay);
}

function part1(grid: string[][], moves: D[]) {
    let move!: D;
    let robot: P = { x: 0, y: 0 };

    for (let y = 0; y < grid.length; y++) {
        const i = grid[y].indexOf('@');

        if (i !== -1) {
            robot = { x: i, y };
            break;
        }
    }

    while ((move = moves.shift()!)) {
        const d = mapDirection(move);
        const newRobotP: P = { x: robot.x + d.x, y: robot.y + d.y };

        const boxes: P[] = [];
        let newBoxP = newRobotP;

        while (true) {
            if (grid[newBoxP.y]?.[newBoxP.x] === 'O') {
                const newBoxP2 = { x: newBoxP.x + d.x, y: newBoxP.y + d.y };

                if (
                    grid[newBoxP2.y]?.[newBoxP2.x] === '.' ||
                    grid[newBoxP2.y]?.[newBoxP2.x] === 'O'
                ) {
                    boxes.push(newBoxP2);
                }
            } else if (grid[newBoxP.y]?.[newBoxP.x] === '.') {
                break;
            } else if (grid[newBoxP.y]?.[newBoxP.x] === '#') {
                boxes.length = 0;
                break;
            }

            newBoxP = { x: newBoxP.x + d.x, y: newBoxP.y + d.y };
        }

        boxes.forEach((box) => {
            grid[box.y][box.x] = 'O';
        });

        if (grid[newRobotP.y]?.[newRobotP.x] === '.' || boxes.length) {
            grid[newRobotP.y][newRobotP.x] = '@';
            grid[robot.y][robot.x] = '.';
            robot = newRobotP;
        }
    }

    let total = 0;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 'O') {
                total += 100 * y + x;
            }
        }
    }

    console.log('part 1:', total);
}

function part2(moves: D[]) {
    const grid = lines(
        rawGrid
            .replace(/#/g, '##')
            .replace(/O/g, '[]')
            .replace(/\./g, '..')
            .replace(/@/g, '@.')
    ).map((line) => line.split(''));

    let move!: D;
    let robot: P = { x: 0, y: 0 };

    for (let y = 0; y < grid.length; y++) {
        const i = grid[y].indexOf('@');

        if (i !== -1) {
            robot = { x: i, y };
            break;
        }
    }

    while ((move = moves.shift()!)) {
        const d = mapDirection(move);
        const rx = robot.x + d.x;
        const ry = robot.y + d.y;
        const movedRobot: P = { x: rx, y: ry, c: grid[ry]?.[rx] };

        let boxes: P[][] = [];

        if (movedRobot.c === '[' || movedRobot.c === ']') {
            const box =
                movedRobot.c === '['
                    ? [
                          { x: movedRobot.x, y: movedRobot.y, c: '[' },
                          { x: movedRobot.x + 1, y: movedRobot.y, c: ']' }
                      ]
                    : [
                          { x: movedRobot.x - 1, y: movedRobot.y, c: '[' },
                          { x: movedRobot.x, y: movedRobot.y, c: ']' }
                      ];

            boxes.push(box);

            while (true) {
                let moveBoxes = false;

                boxes = boxes
                    .flatMap((box) => {
                        const [l, r] = box;
                        const lx = l.x + d.x;
                        const ly = l.y + d.y;
                        const rx = r.x + d.x;
                        const ry = r.y + d.y;
                        const lc = grid[ly]?.[lx];
                        const rc = grid[ry]?.[rx];

                        if (move === '<' || move === '>') {
                            if (lc === '.' || rc === '.') {
                                moveBoxes = true;
                            }
                        } else {
                            if (lc === '.' && rc === '.') {
                                moveBoxes = true;
                            }
                        }

                        const nextBox: [P, P] = [
                            {
                                x: lx,
                                y: ly,
                                c: lc
                            },
                            {
                                x: rx,
                                y: ry,
                                c: rc
                            }
                        ];
                        let nextBoxes: P[][] = [];

                        if (nextBox[0].c === ']') {
                            const bx1 = nextBox[0].x - 1;
                            const by1 = nextBox[0].y;

                            const bx2 = nextBox[0].x;
                            const by2 = nextBox[0].y;

                            nextBoxes.push([
                                {
                                    x: bx1,
                                    y: by1,
                                    c: '['
                                },
                                {
                                    x: bx2,
                                    y: by2,
                                    c: ']'
                                }
                            ]);
                        }

                        if (nextBox[1].c === '[') {
                            const bx1 = nextBox[1].x;
                            const by1 = nextBox[1].y;

                            const bx2 = nextBox[1].x + 1;
                            const by2 = nextBox[1].y;

                            nextBoxes.push([
                                {
                                    x: bx1,
                                    y: by1,
                                    c: '['
                                },
                                {
                                    x: bx2,
                                    y: by2,
                                    c: ']'
                                }
                            ]);
                        }

                        if (nextBox[0].c === '[' && nextBox[1].c === ']') {
                            nextBoxes.push(nextBox);
                        }

                        return [box, ...nextBoxes];
                    })
                    .filter(
                        ([l, r]) =>
                            l.c !== '.' &&
                            r.c !== '.' &&
                            l.c !== '#' &&
                            r.c !== '#'
                    );

                if (
                    boxes.some((box) => {
                        if (
                            /[#]/.test(grid[box[0].y + d.y][box[0].x + d.x]) ||
                            /[#]/.test(grid[box[1].y + d.y][box[1].x + d.x])
                        ) {
                            return true;
                        }

                        return false;
                    })
                ) {
                    boxes = [];
                    break;
                }

                if (moveBoxes) {
                    const lastBoxes = boxes.slice(-3);

                    if (move === 'v' || move === '^') {
                        if (
                            !lastBoxes.every((box) => {
                                if (
                                    /[\[\]#]/.test(
                                        grid[box[0].y + d.y][box[0].x + d.x]
                                    ) ||
                                    /[\[\]#]/.test(
                                        grid[box[1].y + d.y][box[1].x + d.x]
                                    )
                                ) {
                                    return false;
                                }

                                return true;
                            })
                        ) {
                            continue;
                        }
                    }

                    // clear boxes
                    boxes.forEach(([l, r]) => {
                        grid[l.y][l.x] = '.';
                        grid[r.y][r.x] = '.';
                    });

                    // move boxes
                    boxes.forEach(([l, r]) => {
                        grid[l.y + d.y][l.x + d.x] = l.c!;
                        grid[r.y + d.y][r.x + d.x] = r.c!;
                    });
                    boxes = [];

                    grid[robot.y][robot.x] = '.';
                    grid[movedRobot.y][movedRobot.x] = '@';
                    robot = movedRobot;
                    break;
                }
            }
        } else if (movedRobot.c === '.') {
            grid[robot.y][robot.x] = '.';
            grid[movedRobot.y][movedRobot.x] = '@';
            robot = movedRobot;
        }
        draw(grid);
    }

    let total = 0;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === '[') {
                total += 100 * y + x;
            }
        }
    }

    console.log('part 2:', total);
}

console.time('part1');
part1(
    grid.map((line) => [...line]),
    [...moves]
);
console.timeEnd('part1');

console.time('part2');
part2([...moves]);
console.timeEnd('part2');
