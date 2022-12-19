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

function inCubes(cube: Cube, needle = cubes) {
    return needle.some(
        ([x, y, z]) => x === cube[0] && y === cube[1] && z === cube[2]
    );
}

function part2() {
    const maxX = cubes.reduce((x, [cx]) => Math.max(x, cx), 0);
    const maxY = cubes.reduce((y, [, cy]) => Math.max(y, cy), 0);
    const maxZ = cubes.reduce((z, [, , cz]) => Math.max(z, cz), 0);

    const candidates: Cube[] = [];

    for (let cx = 0; cx <= maxX; cx++) {
        for (let cy = 0; cy <= maxY; cy++) {
            for (let cz = 0; cz <= maxZ; cz++) {
                if (!inCubes([cx, cy, cz])) {
                    candidates.push([cx, cy, cz]);
                }
            }
        }
    }

    function getNeighbors(cube: Cube): Cube[] {
        const [x, y, z] = cube;

        return [
            [x - 1, y, z],
            [x + 1, y, z],
            [x, y - 1, z],
            [x, y + 1, z],
            [x, y, z - 1],
            [x, y, z + 1]
        ].filter(
            ([x, y, z]) =>
                x >= 0 &&
                x <= maxX &&
                y >= 0 &&
                y <= maxY &&
                z >= 0 &&
                z <= maxZ
        ) as Cube[];
    }

    function scanSurroundings(cube: Cube) {
        const neighbors = getNeighbors(cube);

        if (neighbors.every((n) => inCubes(n))) {
            return true;
        }

        return false;
    }

    const trapped = candidates.reduce((trapped, cube) => {
        if (!trapped.has(`${cube}`) && scanSurroundings(cube)) {
            trapped.add(`${cube}`);
        }

        return trapped;
    }, new Set<string>());

    // 4078: too high
    // 4054
    // 3598
    // 2728: too high
    return part1() - trapped.size;
}

console.time('part 1');
console.log('part 1:', part1());
console.timeEnd('part 1');

console.time('part 2');
console.log('part 2:', part2());
console.timeEnd('part 2');
