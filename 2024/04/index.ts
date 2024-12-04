import path from 'path';
import { lines, readFile } from '../utils';

const input = lines(readFile('./input.txt'));
const grid = input.map((line) => line.split(''));

interface P {
    x: number;
    y: number;
}

function findInDirection(
    letter: string,
    origin: P,
    direction: P
): P | undefined {
    const x = origin.x + direction.x;
    const y = origin.y + direction.y;

    if (grid[y] && grid[y][x] === letter) {
        return { x, y };
    }

    return undefined;
}

function findLetters(letter: string, origin: P): P[] {
    const yStart = Math.max(origin.y - 1, 0);
    const yEnd = Math.min(origin.y + 1, grid.length - 1);
    const xStart = Math.max(origin.x - 1, 0);
    const xEnd = Math.min(origin.x + 1, grid[0].length - 1);

    const found: P[] = [];

    for (let y = yStart; y <= yEnd; y++) {
        const row = grid[y];

        for (let x = xStart; x <= xEnd; x++) {
            const cell = row[x];

            if (cell === letter) {
                found.push({ x, y });
            }
        }
    }

    return found;
}

function findMas(mP: P): P[][] {
    const paths: P[][] = [];
    const aLetters = [
        findInDirection('A', mP, { x: -1, y: -1 }),
        findInDirection('A', mP, { x: 1, y: -1 }),
        findInDirection('A', mP, { x: -1, y: 1 }),
        findInDirection('A', mP, { x: 1, y: 1 })
    ].filter((p): p is P => Boolean(p));

    aLetters.forEach((aP, i) => {
        const sP = findInDirection('S', aP, {
            x: aP.x - mP.x,
            y: aP.y - mP.y
        });

        if (sP) {
            paths[i] = [mP, aP, sP];
        }
    });

    return paths.filter((ps) => ps.length === 3);
}

function part1() {
    console.time('part 1');
    const paths: P[][] = [];

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];

        for (let x = 0; x < row.length; x++) {
            const cell = row[x];

            if (cell === 'X') {
                const xP: P = { x, y };

                const mLetters = findLetters('M', xP);

                mLetters.forEach((mP) => {
                    const aP = findInDirection('A', mP, {
                        x: mP.x - xP.x,
                        y: mP.y - xP.y
                    });

                    if (aP) {
                        const sP = findInDirection('S', aP, {
                            x: aP.x - mP.x,
                            y: aP.y - mP.y
                        });

                        if (sP) {
                            paths.push([xP, mP, aP, sP]);
                        }
                    }
                });
            }
        }
    }

    console.log('part 1:', paths.length);
    console.timeEnd('part 1');
}

function part2() {
    console.time('part 2');

    const paths: P[][] = [];

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];

        for (let x = 0; x < row.length; x++) {
            const cell = row[x];

            if (cell === 'M') {
                const mP: P = { x, y };

                const masP = findMas(mP);

                if (masP.length) {
                    masP.forEach((p) => paths.push(p));
                }
            }
        }
    }

    const xPairs: P[][][] = [];

    for (let i = 0; i < paths.length; i++) {
        const p1 = paths[i];
        const pair = [p1];

        for (let j = 0; j < paths.length; j++) {
            const p2 = paths[j];

            if (p1 === p2) {
                continue;
            }

            const [, aP] = p1;
            const [, aP2] = p2;

            if (aP.x === aP2.x && aP.y === aP2.y) {
                pair.push(p2);
                break;
            }
        }

        if (pair.length === 2) {
            xPairs.push(pair);
        }
    }

    console.log('part 2:', xPairs.length / 2);

    console.timeEnd('part 2');
}

part1();
part2();
