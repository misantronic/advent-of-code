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

function findNumericPaths(cmds: NumericCmd[]) {
    let cur = numericKeypadMap.A;
    let completePaths: string[][] = [];

    let i = 0;

    for (const cmd of cmds) {
        const target = numericKeypadMap[cmd];

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

                if (numericKeypad[ny]?.[nx] !== undefined) {
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

function findDirectionalPath(cmds: Map<string, number>) {
    const pathMap = new Map<string, number>();

    let [startX, startY] = directionalKeypadMap.A;

    for (const [cmdLine, count] of cmds) {
        for (const cmd of cmdLine.split('') as DirectionalCmd[]) {
            const queue = new PriorityQueue<[number, number, number, string]>([
                { item: [startX, startY, 0, ''], priority: 0 }
            ]);

            while (!queue.isEmpty()) {
                const [x, y, cost, path] = queue.dequeue()!;
                const [targetX, targetY] = directionalKeypadMap[cmd];

                if (x === targetX && y === targetY) {
                    startX = x;
                    startY = y;

                    pathMap.set(
                        `${path}A`,
                        (pathMap.get(`${path}A`) ?? 0) + count
                    );
                    break;
                }

                for (const [dx, dy] of dirs) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (directionalKeypad[ny]?.[nx] !== undefined) {
                        const newCost = cost + 1;
                        const d = dirMap[`${dx},${dy}`];

                        queue.enqueue(
                            [nx, ny, newCost, `${path}${d}`],
                            newCost
                        );
                    }
                }
            }
        }
    }

    return pathMap;
}

[input2].forEach((name) => {
    const inputs = lines(readFile(name)).map((line) =>
        line.split('').map((c) => (c === 'A' ? 'A' : Number(c)))
    ) as NumericCmd[][];

    function run(robots: number) {
        let total = 0;

        for (const cmds of inputs) {
            const numericPaths = findNumericPaths(cmds);

            let min = Infinity;

            for (const numericPath of numericPaths) {
                let path = findDirectionalPath(new Map([[numericPath, 1]]));

                for (let i = 1; i <= robots; i++) {
                    path = findDirectionalPath(path);

                    if (i === robots) {
                        const len = path.values().reduce((a, b) => a + b, 0);

                        if (len < min) {
                            min = len;
                        }
                    }
                }
            }

            total += parseInt(cmds.join('')) * min;
        }

        return total;
    }

    console.time('part 1');
    console.log(name, 'part 1', run(2));
    console.timeEnd('part 1');

    console.time('part 2');
    console.log(name, 'part 2', run(4));
    console.timeEnd('part 2');
});

// 90239886870544 wrong
// 225887582184500 wrong
// 223025752849578 too high
// 223880182934570 too high
