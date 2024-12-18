import { lines, PriorityQueue, readFile } from '../utils';

const input1 = './input-example.txt';
const input2 = './input.txt';

[input1, input2].forEach((name) => {
    const coords = lines(readFile(name)).map(
        (line) => line.split(',').map(Number) as [number, number]
    );

    function run(steps: number, log = false) {
        const size = name === './input.txt' ? 70 : 6;
        const [minX, maxX] = [0, size];
        const [minY, maxY] = [0, size];
        const start: [number, number] = [0, 0];
        const goal: [number, number] = [size, size];

        const partialCoords = coords.slice(0, steps);

        const visited = new Set<string>([`${start[0]},${start[1]}`]);
        const queue = new PriorityQueue<[number, number, number]>([
            {
                item: [...start, 0],
                priority: 0
            }
        ]);

        const dirs = [
            [0, 1],
            [1, 0],
            [-1, 0],
            [0, -1]
        ];

        let done = false;

        while (!queue.isEmpty()) {
            const [x, y, cost] = queue.dequeue()!;

            if (x === goal[0] && y === goal[1]) {
                done = true;

                if (log) {
                    console.log(name, 'part 1:', cost);
                }
                break;
            }

            for (const [dx, dy] of dirs) {
                const [nx, ny] = [x + dx, y + dy];
                const newCoord = `${nx},${ny}`;

                if (
                    nx < minX ||
                    nx > maxX ||
                    ny < minY ||
                    ny > maxY ||
                    visited.has(newCoord)
                ) {
                    continue;
                }

                if (partialCoords.some(([x, y]) => x === nx && y === ny)) {
                    continue;
                }

                queue.enqueue([nx, ny, cost + 1], cost + 1);

                visited.add(newCoord);
            }
        }

        if (!done) {
            return coords[steps - 1].join(',');
        }

        return undefined;
    }

    console.time('part 1');
    run(name === './input.txt' ? 1024 : 12, true);
    console.timeEnd('part 1');

    console.time('part 2');
    let startI = name === './input.txt' ? 1024 : 12;

    for (let i = startI; i < coords.length; i++) {
        const res = run(i, false);

        if (res) {
            console.log(name, 'part 2:', res);
            console.timeEnd('part 2');
            break;
        }
    }
});

// 820 too high
// 819 too high
// 424 too high
