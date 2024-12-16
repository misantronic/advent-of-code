import { lines, readFile } from '../utils';

// grid looks like this:
// ###############
// #.......#....E#
// #.#.###.#.###.#
// #.....#.#...#.#
// #.###.#####.#.#
// #.#.#.......#.#
// #.#.#####.###.#
// #...........#.#
// ###.#.#####.#.#
// #...#.....#.#.#
// #.#.#.###.#.#.#
// #.....#...#.#.#
// #.###.#.#.#.#.#
// #S..#.....#...#
// ###############
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

console.time('part 1');
console.log('part 1:', dijkstra());
console.timeEnd('part 1');

// console.time('part 2');
// console.log('part 2:', findAllPaths());
// console.timeEnd('part 2');
