import { Dir } from 'fs';
import { lines, PriorityQueue, readFile } from '../utils';

const input1 = './input-example.txt';
const input2 = './input.txt';

type P = [number, number];

// +---+---+---+
// | 7 | 8 | 9 |
// +---+---+---+
// | 4 | 5 | 6 |
// +---+---+---+
// | 1 | 2 | 3 |
// +---+---+---+
//     | 0 | A |
//     +---+---+
const numericKeypad = [
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
    [, 0, 'A']
] as const;

const numericKeypadMap = {
    0: [1, 3] as P,
    1: [0, 2] as P,
    2: [1, 2] as P,
    3: [2, 2] as P,
    4: [0, 1] as P,
    5: [1, 1] as P,
    6: [2, 1] as P,
    7: [0, 0] as P,
    8: [1, 0] as P,
    9: [2, 0] as P,
    A: [2, 3] as P
};

const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
] as const;

const dirMap = {
    '0,-1': '^',
    '1,0': '>',
    '0,1': 'v',
    '-1,0': '<'
} as Record<string, string>;

//     +---+---+
//     | ^ | A |
// +---+---+---+
// | < | v | > |
// +---+---+---+
const directionalKeypad = [
    [, '^', 'A'],
    ['<', 'v', '>']
] as const;

const directionalKeypadMap = {
    '^': [1, 0] as P,
    A: [2, 0] as P,
    '<': [0, 1] as P,
    v: [1, 1] as P,
    '>': [2, 1] as P
} as Record<DirectionalCmd, P>;

type NumericCmd = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'A';
type DirectionalCmd = '^' | 'v' | '<' | '>' | 'A';

function findPath(
    cmds: (DirectionalCmd | NumericCmd)[],
    keypad: typeof numericKeypad | typeof directionalKeypad,
    keypadMap: Record<string, P>
) {
    let cur = keypadMap.A;
    let completePaths: string[][] = [];

    let i = 0;

    for (const cmd of cmds) {
        const target = keypadMap[cmd];

        const queue = new PriorityQueue<[number, number, number, string]>([
            { item: [...cur, 0, ''], priority: 0 }
        ]);
        const lowestCosts = new Map<string, number>();

        while (!queue.isEmpty()) {
            const [x, y, cost, path] = queue.dequeue()!;

            const key = `${x},${y}`;
            const prevCost = lowestCosts.get(key) ?? Infinity;

            if (cost > prevCost) {
                continue;
            }

            if (x === target[0] && y === target[1]) {
                cur = [x, y];

                const newPath = `${path}A`;
                const shortest = completePaths[i]?.[0]?.length ?? Infinity;

                if (newPath.length <= shortest) {
                    completePaths[i] = [...(completePaths[i] ?? []), newPath];
                }
                continue;
            }

            for (const [dx, dy] of dirs) {
                const nx = x + dx;
                const ny = y + dy;

                if (keypad[ny]?.[nx] !== undefined) {
                    const newCost = cost + 1;
                    const d = dirMap[`${dx},${dy}`];

                    lowestCosts.set(key, newCost);

                    queue.enqueue([nx, ny, newCost, `${path}${d}`], newCost);
                }
            }
        }

        i++;
    }

    const combinedPaths: string[][] = [];

    function combinePaths(paths: string[][], index: number, current: string) {
        if (index === paths.length) {
            combinedPaths.push([current]);
            return;
        }

        for (const path of paths[index]) {
            combinePaths(paths, index + 1, current + path);
        }
    }

    combinePaths(completePaths, 0, '');

    const res = combinedPaths.map((path) => path.join(''));

    return res;
}

function findShortestPath() {}

[input2].forEach((name) => {
    const inputs = lines(readFile(name)).map((line) =>
        line.split('').map((c) => (c === 'A' ? 'A' : Number(c)))
    ) as NumericCmd[][];

    let total = 0;

    for (const cmds of inputs) {
        let all = new Set<string>();

        const numRobots = 2;
        const numericPaths = findPath(cmds, numericKeypad, numericKeypadMap);

        console.log(numericPaths);

        for (const numericPath of numericPaths) {
            let directionalPaths = findPath(
                numericPath.split('') as DirectionalCmd[],
                directionalKeypad,
                directionalKeypadMap
            );

            for (let i = 1; i <= numRobots - 1; i++) {
                for (const path of directionalPaths) {
                    directionalPaths = findPath(
                        path.split('') as DirectionalCmd[],
                        directionalKeypad,
                        directionalKeypadMap
                    );

                    if (i === numRobots - 1) {
                        directionalPaths.forEach((p) => all.add(p));
                    }
                }
            }
        }

        let min = Infinity;

        for (const path of all) {
            min = Math.min(min, path.length);
        }

        total += parseInt(cmds.join('')) * min;
    }

    console.log(name, 'part 1', total);
});
