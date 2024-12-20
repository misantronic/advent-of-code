import { lines, PriorityQueue, readFile } from '../utils';

const input1 = readFile('./input-example.txt');
const input3 = readFile('./input.txt');

[input1].forEach((c) => {
    const grid = lines(c).map(
        (line) => line.split('') as ('.' | '#' | 'S' | 'E')[]
    );

    let E: [number, number] = [0, 0];
    let S: [number, number] = [0, 0];

    const dirs = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0]
    ] as const;

    const walls: [number, number][] = [];

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 'S') {
                S = [x, y];
            }

            if (grid[y][x] === 'E') {
                E = [x, y];
            }

            if (grid[y][x] === '#') {
                walls.push([x, y]);
            }
        }
    }

    const dijkstra = (grid: string[][]) => {
        const queue = new PriorityQueue<
            [number, number, number, number, Set<string>]
        >([
            {
                item: [S[0], S[1], 0, 0, new Set([`${S[0]},${S[1]}`])],
                priority: 0
            }
        ]);
        const result: Set<string>[] = [];

        const visited = new Set<string>();

        while (!queue.isEmpty()) {
            const [x, y, cost, cheat, path] = queue.dequeue()!;

            if (x === E[0] && y === E[1]) {
                console.log('found: cost', path.size, 'cheat:', cheat);
                result.push(path);
                continue;
            }

            for (const [dx, dy] of dirs) {
                const [nx, ny] = [x + dx, y + dy];
                const newCoord = `${nx},${ny}`;

                if (
                    nx < 0 ||
                    nx >= grid[0].length ||
                    ny < 0 ||
                    ny >= grid.length ||
                    (grid[ny][nx] === '#' && cheat >= 20) ||
                    path.has(newCoord)
                ) {
                    continue;
                }

                // console.log({ nx, ny, cheat });

                queue.enqueue(
                    [
                        nx,
                        ny,
                        cost + 1,
                        grid[ny][nx] === '#' ? cheat + 1 : cheat,
                        new Set([...path, newCoord])
                    ],
                    cost + 1
                );

                // path.add(newCoord);
            }
        }

        return result;
    };

    console.time('part 1');

    const base = dijkstra(grid);

    console.log('base', base);

    const costMap = new Map<number, number>();

    // walls.forEach((_, i) => {
    //     const save = base - dijkstra(grid);

    //     if (costMap.has(save)) {
    //         costMap.set(save, costMap.get(save)! + 1);
    //     } else {
    //         costMap.set(save, 1);
    //     }
    // });

    // let total = 0;

    // for (const [costSave, count] of costMap) {
    //     if (costSave >= 100) {
    //         total += count;
    //     }
    // }

    // console.log(costMap);

    // console.log('part 1:', total);
    console.timeEnd('part 1');

    // console.time('part 2');
    // console.log('part 2:', findShortestPaths(lowestCost));
    // console.timeEnd('part 2');

    console.log();
});

// 390 too low
