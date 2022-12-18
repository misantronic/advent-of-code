import { readFile } from '../utils';

const input = readFile('input.txt');

const jetList = input.split('').map((char) => (char === '<' ? -1 : 1));

interface Point {
    x: number;
    y: number;
}

interface Rock {
    shape: Point[];
    width: number;
    height: number;
    pos: Point;
}

const shapes: Point[][] = [
    [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 }
    ],
    [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 2 }
    ],
    [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 2, y: 2 }
    ],
    [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 }
    ],
    [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 }
    ]
];

function equal(a?: Point, b?: Point) {
    return a?.x === b?.x && a?.y === b?.y;
}

function newRock(shapeIndex: number): Rock {
    const shape = shapes[shapeIndex];
    const width = Math.max(...shape.map(({ x }) => x)) + 1;
    const height = Math.max(...shape.map(({ y }) => y)) + 1;
    const x = 2;
    const y =
        staleRocks
            .slice(staleRocks.length - 50)
            .reduce(
                (y, rock) => Math.max(y, rock.pos.y + rock.height - 1),
                floorY
            ) + 4;

    const rock = {
        width,
        height,
        pos: { x, y },
        shape
    };

    return rock;
}

function hitRock(rock: Rock, point: Point) {
    const newX = rock.pos.x + point.x;
    const newY = rock.pos.y + point.y;

    const newPoints = rock.shape.map<Point>((p) => ({
        x: newX + p.x,
        y: newY + p.y
    }));

    for (const staleRock of staleRocks.slice(staleRocks.length - 25)) {
        for (const shape of staleRock.shape) {
            const x = staleRock.pos.x + shape.x;
            const y = staleRock.pos.y + shape.y;

            if (newPoints.some((p) => equal(p, { x, y }))) {
                return true;
            }
        }
    }

    return false;
}

function moveRockX(rock: Rock, x: number) {
    const newX = rock.pos.x + x;

    if (hitRock(rock, { x, y: 0 })) {
        return false;
    }

    // walls
    if (newX < 0 || newX + rock.width > chamberWidth) {
        return false;
    }

    rock.pos.x = newX;

    return true;
}

function moveRockY(rock: Rock) {
    const newY = rock.pos.y - 1;

    if (hitRock(rock, { x: 0, y: -1 })) {
        return false;
    }

    if (newY === floorY) {
        return false;
    }

    rock.pos.y = newY;

    return true;
}

function nextJet() {
    jetIndex++;

    if (jetIndex === jetList.length) {
        jetIndex = 0;
    }
}

function nextShapeIndex() {
    shapeIndex++;

    if (shapeIndex === shapes.length) {
        shapeIndex = 0;
    }
}

function draw(minY = 0) {
    const minX = -1;
    const maxX = chamberWidth;
    const maxY =
        staleRocks
            .slice(staleRocks.length - 25)
            .reduce((y, rock) => Math.max(y, rock.pos.y), 4) + rock.height;
    // const output: string[] = [];
    const binary: number[] = [];

    for (let y = minY; y <= maxY; y++) {
        // const line: string[] = [`${y.toString().padStart(4, '0')} `];

        let bin = '0b';

        for (let x = minX; x <= maxX; x++) {
            const char = (() => {
                for (const rock of staleRocks) {
                    for (const shape of rock.shape) {
                        const xx = rock.pos.x + shape.x;
                        const yy = rock.pos.y + shape.y;

                        if (xx === x && yy === y) {
                            return '#';
                        }
                    }
                }

                for (const shape of rock.shape) {
                    const xx = rock.pos.x + shape.x;
                    const yy = rock.pos.y + shape.y;

                    if (xx === x && yy === y) {
                        return '@';
                    }
                }

                if (y === floorY) {
                    return x === minX || x === maxX ? '+' : '-';
                }

                if (x === minX || x === maxX) {
                    return '|';
                }

                return '.';
            })();

            if (x >= 0 && x < maxX) {
                bin = `${bin}${char === '#' ? '1' : '0'}`;
            }

            // line.push(char);
        }

        binary.push(eval(bin));

        // output.push(line.join(''));
    }

    // console.log(output.reverse().join('\n'));
    // console.log('');

    return binary.filter(Boolean);
}

const chamberWidth = 7;
let jetIndex = 0;
let shapeIndex = 0;
const floorY = 0;
const staleRocks: Rock[] = [];
let rock = newRock(shapeIndex);

console.time('part 1');
console.time('part 2');

let binaryPart1: number[] = [];
let binaryPart2: number[] = [];

while (true) {
    const x = jetList[jetIndex];

    moveRockX(rock, x);

    if (!moveRockY(rock)) {
        staleRocks.push(rock);
        nextShapeIndex();

        rock = newRock(shapeIndex);
    }

    nextJet();

    if (staleRocks.length === 2454) {
        binaryPart1 = draw();

        console.log('part 1:', binaryPart1.length);
        console.timeEnd('part 1');
    }

    if (staleRocks.length === 5000) {
        binaryPart2 = draw();
        break;
    }
}

console.log('part 2', binaryPart2.length);
console.log(binaryPart2.join(','));
console.timeEnd('part 2');

//     7_352_941_240    too low
// 1_571_730_910_400    too high
// 1_549_460_675_087
//  427_6252_560_418
