import { lines, readFile } from '../utils';

const grid = lines(readFile('./input.txt')).map((line) => line.split(''));

const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 }
];

function findPermeters() {
    const perimeters: Set<string>[] = [];

    const find = (x: number, y: number) => {
        const letter = grid[y][x];

        let hasPerimeter = false;

        for (const perimeter of perimeters) {
            if (perimeter.has(`${x},${y}`)) {
                hasPerimeter = true;
            }

            for (const d of directions) {
                const nextX = x + d.x;
                const nextY = y + d.y;

                if (!grid[nextY]?.[nextX]) {
                    continue;
                }

                if (perimeter.has(`${nextX},${nextY}`)) {
                    continue;
                }

                if (
                    grid[nextY][nextX] === letter &&
                    perimeter.has(`${x},${y}`) &&
                    !perimeter.has(`${nextX},${nextY}`)
                ) {
                    hasPerimeter = true;
                    perimeter.add(`${nextX},${nextY}`);

                    find(nextX, nextY);
                }
            }
        }

        return hasPerimeter;
    };

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (!find(x, y)) {
                perimeters.push(new Set([`${x},${y}`]));

                find(x, y);
            }
        }
    }

    return perimeters;
}

function perimeterBorders(perimeter: Set<string>) {
    const cnt: number[][] = [];

    for (const point of perimeter) {
        const [x, y] = point.split(',').map(Number);

        for (const d of directions) {
            const nextX = x + d.x;
            const nextY = y + d.y;

            if (!perimeter.has(`${nextX},${nextY}`)) {
                cnt.push([nextX, nextY]);
            }
        }
    }

    return cnt;
}

function perimeterPrice(perimeters: Set<string>[]) {
    let totalPrice = 0;

    for (const perimeter of perimeters) {
        const borders = perimeterBorders(perimeter);

        const price = perimeter.size * borders.length;

        totalPrice += price;
    }

    return totalPrice;
}

function perimeterSidePrice(perimeters: Set<string>[]) {
    let totalPrice = 0;

    for (const perimeter of perimeters) {
        let corners = 0;

        for (const point of perimeter) {
            let [curX, curY] = point.split(',').map(Number);

            // top-left corner
            if (
                !perimeter.has(`${curX - 1},${curY}`) &&
                !perimeter.has(`${curX},${curY - 1}`)
            ) {
                corners++;
            }

            // top-right corner
            if (
                !perimeter.has(`${curX + 1},${curY}`) &&
                !perimeter.has(`${curX},${curY - 1}`)
            ) {
                corners++;
            }

            // bottom-right corner
            if (
                !perimeter.has(`${curX + 1},${curY}`) &&
                !perimeter.has(`${curX},${curY + 1}`)
            ) {
                corners++;
            }

            // bottom-left corner
            if (
                !perimeter.has(`${curX - 1},${curY}`) &&
                !perimeter.has(`${curX},${curY + 1}`)
            ) {
                corners++;
            }

            // diagonal corner tr
            if (
                !perimeter.has(`${curX + 1},${curY - 1}`) &&
                perimeter.has(`${curX},${curY - 1}`) &&
                perimeter.has(`${curX + 1},${curY}`)
            ) {
                corners++;
            }

            // diagonal corner br
            if (
                !perimeter.has(`${curX + 1},${curY + 1}`) &&
                perimeter.has(`${curX},${curY + 1}`) &&
                perimeter.has(`${curX + 1},${curY}`)
            ) {
                corners++;
            }

            // diagonal corner bl
            if (
                !perimeter.has(`${curX - 1},${curY + 1}`) &&
                perimeter.has(`${curX},${curY + 1}`) &&
                perimeter.has(`${curX - 1},${curY}`)
            ) {
                corners++;
            }

            // diagonal corner tl
            if (
                !perimeter.has(`${curX - 1},${curY - 1}`) &&
                perimeter.has(`${curX},${curY - 1}`) &&
                perimeter.has(`${curX - 1},${curY}`)
            ) {
                corners++;
            }
        }

        totalPrice += perimeter.size * corners;
    }

    return totalPrice;
}

console.time('part 1');
const perimeters = findPermeters();

console.log('part 1', perimeterPrice(perimeters));
console.timeEnd('part 1');

console.time('part 2');
console.log('part 2', perimeterSidePrice(perimeters));
console.timeEnd('part 2');
