import { lines, PriorityQueue, readFile } from '../utils';

const input1 = './input-example.txt';
const input2 = './input.txt';

[input1, input2].forEach((name) => {
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
        const queue = new PriorityQueue<[number, number, number]>([
            { item: [S[0], S[1], 0], priority: 0 }
        ]);

        const visited = new Set<string>();

        while (!queue.isEmpty()) {
            const [x, y, cost] = queue.dequeue()!;

            if (x === E[0] && y === E[1]) {
                return cost;
            }

            for (const [dx, dy] of dirs) {
                const [nx, ny] = [x + dx, y + dy];
                const newCoord = `${nx},${ny}`;

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
                        visited.has(newCoord)
                    ) {
                        continue;
                    }
                }

                queue.enqueue([nx, ny, cost + 1], cost + 1);

                visited.add(newCoord);
            }
        }

        return -1;
    };

    console.time('part 1');

    const base = dijkstra(grid, -1);

    console.log('base cost', base);

    const costMap = new Map<number, number>();

    walls.forEach((_, i) => {
        const save = base - dijkstra(grid, i);

        if (costMap.has(save)) {
            costMap.set(save, costMap.get(save)! + 1);
        } else {
            costMap.set(save, 1);
        }
    });

    let total = 0;

    for (const [costSave, count] of costMap) {
        if (costSave >= (name === './input.txt' ? 100 : 1)) {
            total += count;
        }
    }

    console.log('part 1:', total);
    console.timeEnd('part 1');

    // console.time('part 2');
    // console.log('part 2:', findShortestPaths(lowestCost));
    // console.timeEnd('part 2');

    console.log();
});

// 390 too low
