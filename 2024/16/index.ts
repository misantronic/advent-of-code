import { lines, readFile } from '../utils';

const grid = lines(readFile('./input-example2.txt')).map(
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
    const queue: State[] = [{ position: S, direction: 1, cost: 0 }];
    const visited = new Set<string>();

    while (queue.length > 0) {
        // Sort the queue based on cost to simulate priority queue behavior
        queue.sort((a, b) => a.cost - b.cost);

        const {
            position: [x, y],
            direction,
            cost
        } = queue.shift()!;

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
            queue.push({ position: [newX, newY], direction, cost: cost + 1 });
        }

        // Rotate left
        queue.push({
            position: [x, y],
            direction: (direction + 3) % 4,
            cost: cost + 1000
        });

        // Rotate right
        queue.push({
            position: [x, y],
            direction: (direction + 1) % 4,
            cost: cost + 1000
        });
    }

    return -1;
};

const findShortestPaths = (lowestCost: number) => {
    const queue: State[] = [
        {
            position: S,
            direction: 1,
            cost: 0,
            visited: new Set<string>()
        }
    ];
    const tiles = new Set<string>();

    while (queue.length > 0) {
        const {
            position: [x, y],
            direction,
            cost,
            visited
        } = queue.shift()!;

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

        const newVisited = new Set([...visited!, key]);

        const [dx, dy] = directions[direction];
        const newX = x + dx;
        const newY = y + dy;

        // console.log(key, cost);

        const movementCost = cost + 1;

        if (grid[newY][newX] !== '#' && movementCost <= lowestCost) {
            queue.push({
                position: [newX, newY],
                direction,
                cost: movementCost,
                visited: newVisited
            });
        }

        const rotationCost = cost + 1000;
        const leftRotation = (direction + 3) % 4;
        const rightRotation = (direction + 1) % 4;

        if (rotationCost <= lowestCost) {
            if (!visited!.has(`${x},${y},${leftRotation}`)) {
                // Rotate left
                queue.push({
                    position: [x, y],
                    direction: leftRotation,
                    cost: rotationCost,
                    visited: newVisited
                });
            }

            if (!visited!.has(`${x},${y},${rightRotation}`)) {
                // Rotate right
                queue.push({
                    position: [x, y],
                    direction: rightRotation,
                    cost: rotationCost,
                    visited: newVisited
                });
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
