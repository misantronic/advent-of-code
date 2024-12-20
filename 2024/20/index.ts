import { lines, PriorityQueue, readFile } from '../utils';

const input1 = './input-example.txt';
const input2 = './input.txt';

[input1].forEach((name) => {
    const grid = lines(readFile(name)).map(
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

    const dijkstra = (grid: string[][], ignoreWall: number) => {
        const queue = new PriorityQueue<[number, number, number, Set<string>]>([
            { item: [S[0], S[1], 0, new Set()], priority: 0 }
        ]);

        const visited = new Set<string>();

        while (!queue.isEmpty()) {
            const [x, y, cost, path] = queue.dequeue()!;

            if (x === E[0] && y === E[1]) {
                return path;
            }

            for (const [dx, dy] of dirs) {
                const [nx, ny] = [x + dx, y + dy];
                const nxny = `${nx},${ny}`;

                if (
                    walls[ignoreWall]?.[0] === nx &&
                    walls[ignoreWall]?.[1] === ny
                ) {
                    //
                } else {
                    if (
                        nx < 0 ||
                        nx >= grid[0].length ||
                        ny < 0 ||
                        ny >= grid.length ||
                        grid[ny][nx] === '#' ||
                        visited.has(nxny)
                    ) {
                        continue;
                    }
                }

                queue.enqueue(
                    [nx, ny, cost + 1, new Set([...path, nxny])],
                    cost + 1
                );

                visited.add(nxny);
            }
        }

        throw new Error('No path found');
    };

    // console.time('part 1');

    const path = dijkstra(grid, -1);
    const base = path.size;

    console.log('base cost', base);

    const costMap = walls.reduce((map, _, i) => {
        const save = base - dijkstra(grid, i).size;

        return map.set(save, (map.get(save) ?? 0) + 1);
    }, new Map<number, number>());

    let total = 0;

    for (const [costSave, count] of costMap) {
        if (costSave >= (name === './input.txt' ? 100 : 1)) {
            total += count;
        }
    }

    console.log('part 1:', total);
    console.timeEnd('part 1');

    console.time('part 2');

    console.log(path);
    // const paths = findShortestPaths(base);

    console.log('part 2:', 0);
    console.timeEnd('part 2');

    console.log();
});
