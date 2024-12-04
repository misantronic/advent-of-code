import { lines, readFile } from '../utils';

const grid = lines(readFile('./input.txt')).map((line) => line.split(''));

function draw(grid: string[][]) {
    for (let y = 0; y < grid.length; y++) {
        console.log(grid[y].join(''));
    }

    console.log('--');
}

function tilt(grid: string[][], d: 'n' | 's' | 'w' | 'e') {
    let newGrid = grid.map((line) => line.slice());

    const tMax = (() => {
        switch (d) {
            case 'n':
            case 's':
                return grid.length;
            case 'w':
            case 'e':
                return grid[0].length;
        }
    })();

    for (let t = 0; t < tMax; t++) {
        const gridCopy = newGrid.map((line) => line.slice());

        for (let y = 0; y < newGrid.length; y++) {
            for (let x = 0; x < newGrid[y].length; x++) {
                const char = newGrid[y][x];
                const newX = (() => {
                    switch (d) {
                        case 'w':
                            return Math.max(0, x - 1);
                        case 'e':
                            return Math.min(x + 1, newGrid[y].length - 1);
                        case 'n':
                        case 's':
                            return x;
                    }
                })();
                const newY = (() => {
                    switch (d) {
                        case 'n':
                            return Math.max(0, y - 1);
                        case 's':
                            return Math.min(y + 1, newGrid.length - 1);
                        case 'w':
                        case 'e':
                            return y;
                    }
                })();

                if (
                    char === 'O' &&
                    gridCopy[newY][newX] !== 'O' &&
                    gridCopy[newY][newX] !== '#'
                ) {
                    gridCopy[newY][newX] = 'O';
                    gridCopy[y][x] = '.';
                }
            }
        }

        newGrid = gridCopy;
    }

    return newGrid;
}

function calcWeight(grid: string[][]) {
    let weight = 0;

    for (let y = 0; y < grid.length; y++) {
        const line = grid[y];
        const num = line.filter((char) => char === 'O').length;

        weight += num * (grid.length - y);
    }

    return weight;
}

(() => {
    console.time('part 1');

    const p1Grid = tilt(grid, 'n');

    console.log('part 1:', calcWeight(p1Grid));
    console.timeEnd('part 1');
})();

(() => {
    console.time('part 2');

    // no idea how to calculate this, so just brute force it
    let cycles = 93;
    let p2Grid = grid;

    const weights: number[] = [];

    while (cycles > 0) {
        p2Grid = tilt(p2Grid, 'n');
        p2Grid = tilt(p2Grid, 'w');
        p2Grid = tilt(p2Grid, 's');
        p2Grid = tilt(p2Grid, 'e');

        weights.push(calcWeight(p2Grid));

        cycles--;
    }

    console.log('part 2:', calcWeight(p2Grid));
    console.timeEnd('part 2');
})();
