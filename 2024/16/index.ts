import { lines, PriorityQueue, readFile } from '../utils';

const grid = lines(readFile('./input-example.txt')).map(
    (line) => line.split('') as ('.' | '#' | 'S' | 'E')[]
);

let E: [number, number] = [0, 0];
let S: [number, number] = [0, 0];

const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0]
] as const;

for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 'S') {
            S = [x, y];
        }

        if (grid[y][x] === 'E') {
            E = [x, y];
        }
    }
}

type State = {
    position: [number, number];
    direction: number;
    cost: number;
    visited?: Set<string>;
};

const dijkstra = () => {
    const queue = new PriorityQueue<State>();

    queue.enqueue({ position: S, direction: 1, cost: 0 }, 0);

    const visited = new Set<string>();

    while (!queue.isEmpty()) {
        const {
            position: [x, y],
            direction,
            cost
        } = queue.dequeue()!;

        if (x === E[0] && y === E[1]) {
            return cost;
        }

        const key = `${x},${y},${direction}`;

        if (visited.has(key)) continue;

        visited.add(key);

        const [dx, dy] = directions[direction];
        const newX = x + dx;
        const newY = y + dy;

        if (grid[newY][newX] !== '#') {
            queue.enqueue(
                { position: [newX, newY], direction, cost: cost + 1 },
                cost + 1
            );
        }

        // Rotate left
        queue.enqueue(
            {
                position: [x, y],
                direction: (direction + 3) % 4,
                cost: cost + 1000
            },
            cost + 1000
        );

        // Rotate right
        queue.enqueue(
            {
                position: [x, y],
                direction: (direction + 1) % 4,
                cost: cost + 1000
            },
            cost + 1000
        );
    }

    return -1;
};

const findShortestPaths = (lowestCost: number) => {
    const queue = new PriorityQueue<State>();

    queue.enqueue(
        {
            position: S,
            direction: 1,
            cost: 0,
            visited: new Set<string>()
        },
        0
    );
    const tiles = new Set<string>();

    while (!queue.isEmpty()) {
        const {
            position: [x, y],
            direction,
            cost,
            visited
        } = queue.dequeue()!;

        if (cost > lowestCost) {
            continue;
        }

        if (x === E[0] && y === E[1] && cost === lowestCost) {
            for (const v of visited!) {
                const [vx, vy] = v.split(',');

                tiles.add(`${vx},${vy}`);
            }

            tiles.add(`${x},${y}`);

            continue;
        }

        const key = `${x},${y},${direction}`;

        if (visited?.has(key)) continue;

        const newVisited = new Set(visited);

        newVisited.add(key);

        const [dx, dy] = directions[direction];
        const newX = x + dx;
        const newY = y + dy;

        const movementCost = cost + 1;

        if (grid[newY][newX] !== '#' && movementCost <= lowestCost) {
            queue.enqueue(
                {
                    position: [newX, newY],
                    direction,
                    cost: movementCost,
                    visited: newVisited
                },
                movementCost
            );
        }

        const rotationCost = cost + 1000;
        const leftRotation = (direction + 3) % 4;
        const rightRotation = (direction + 1) % 4;

        if (rotationCost <= lowestCost) {
            const [ldX, ldY] = directions[leftRotation];
            const [lrX, lrY] = [x + ldX, y + ldY];

            if (
                !visited!.has(`${x},${y},${leftRotation}`) &&
                grid[lrY][lrX] !== '#'
            ) {
                // Rotate left
                queue.enqueue(
                    {
                        position: [x, y],
                        direction: leftRotation,
                        cost: rotationCost,
                        visited: newVisited
                    },
                    rotationCost
                );
            }

            const [rdX, rdY] = directions[rightRotation];
            const [rrX, rrY] = [x + rdX, y + rdY];

            if (
                !visited!.has(`${x},${y},${rightRotation}`) &&
                grid[rrY][rrX] !== '#'
            ) {
                // Rotate right
                queue.enqueue(
                    {
                        position: [x, y],
                        direction: rightRotation,
                        cost: rotationCost,
                        visited: newVisited
                    },
                    rotationCost
                );
            }
        }
    }

    return tiles.size;
};

console.time('part 1');
const lowestCost = dijkstra();

console.log('part 1:', lowestCost);
console.timeEnd('part 1');

console.time('part 2');
console.log('part 2:', findShortestPaths(lowestCost));
console.timeEnd('part 2');
