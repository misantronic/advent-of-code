import { lines, readFile } from '../utils';

const file: string = 'input.txt';
const robots = lines(readFile(`./${file}`)).map<{ p: P; v: P }>((line) => {
    const match = line.match(/^p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/);

    return {
        p: { x: +match?.[1]!, y: +match?.[2]! },
        v: { x: +match?.[3]!, y: +match?.[4]! }
    };
});

interface P {
    x: number;
    y: number;
}

const maxX = file === 'input-example.txt' ? 11 : 101;
const maxY = file === 'input-example.txt' ? 7 : 103;
const halfX = Math.floor(maxX / 2);
const halfY = Math.floor(maxY / 2);

function draw() {
    console.log();
    const grid = Array.from({ length: maxY }, () => Array(maxX).fill('.'));

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            grid[y][x] = '.';

            for (const robot of robots) {
                if (robot.p.x === x && robot.p.y === y) {
                    grid[y][x] = '#';
                }
            }
        }

        console.log(grid[y].join(''));
    }

    console.log();
}

function move() {
    robots.forEach((robot) => {
        const x = robot.p.x + robot.v.x;
        const y = robot.p.y + robot.v.y;

        robot.p.x = x < 0 ? maxX + x : x % maxX;
        robot.p.y = y < 0 ? maxY + y : y % maxY;
    });
}

function part1() {
    let seconds = 0;

    while (seconds < 100) {
        move();
        seconds++;
    }

    let tl = 0;
    let tr = 0;
    let bl = 0;
    let br = 0;

    tl += robots.filter(
        (robot) => robot.p.x < halfX && robot.p.y < halfY
    ).length;
    tr += robots.filter(
        (robot) => robot.p.x >= halfX + 1 && robot.p.y < halfY
    ).length;
    bl += robots.filter(
        (robot) => robot.p.x < halfX && robot.p.y >= halfY + 1
    ).length;
    br += robots.filter(
        (robot) => robot.p.x >= halfX + 1 && robot.p.y >= halfY + 1
    ).length;

    console.log('part 1', tl * tr * bl * br);
}

function part2() {
    let seconds = 100;

    while (true) {
        move();
        seconds++;

        const xCounts: { [key: number]: number } = {};
        const yCounts: { [key: number]: number } = {};

        robots.forEach((robot) => {
            xCounts[robot.p.x] = (xCounts[robot.p.x] || 0) + 1;
            yCounts[robot.p.y] = (yCounts[robot.p.y] || 0) + 1;
        });

        const manyRobotsX = Object.values(xCounts).filter(
            (count) => count >= 30
        ).length;
        const manyRobotsY = Object.values(yCounts).filter(
            (count) => count >= 30
        ).length;

        if (manyRobotsX > 0 && manyRobotsY > 0) {
            draw();
            console.log('part 2:', seconds);
            break;
        }
    }
}

console.time('part 1');
part1();
console.timeEnd('part 1');

console.time('part 2');
part2();
console.timeEnd('part 2');
