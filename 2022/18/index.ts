import { lines, readFile } from '../utils';

const input = lines(readFile('input.txt'));

type Cube = [number, number, number];

const cubes = input.map((line) => line.split(',').map(Number) as Cube);

function part1() {
    let covered = 0;

    const visited: Cube[] = [];

    for (const cube of cubes) {
        for (const visitedCube of visited) {
            const sides = [
                visitedCube[0] === cube[0],
                visitedCube[1] === cube[1],
                visitedCube[2] === cube[2]
            ];

            if (sides.filter(Boolean).length === 2) {
                const affectedIndex = sides.findIndex((b) => b === false);
                const a = cube[affectedIndex];
                const b = visitedCube[affectedIndex];

                if (a + 1 === b || a - 1 === b || b + 1 === a || b - 1 === a) {
                    covered++;
                }
                if (b + 1 === a || b - 1 === a) {
                    covered++;
                }
            }
        }

        visited.push(cube);
    }

    return cubes.length * 6 - covered;
}

console.log('part1 1:', part1());
