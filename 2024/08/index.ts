import { lines, readFile } from '../utils';

const grid = lines(readFile('./input.txt')).map((line) => line.split(''));

interface Antenna {
    x: number;
    y: number;
    antenna: string;
}

interface Antinode {
    x: number;
    y: number;
}

const withinGrid = (a: Antinode) => {
    return a.x >= 0 && a.x < grid[0].length && a.y >= 0 && a.y < grid.length;
};

function findAntinodes(infinite = false) {
    const antennas: Antenna[] = [];
    const antinodes = new Set<string>();

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] !== '.') {
                antennas.push({ x, y, antenna: grid[y][x] });
            }
        }
    }

    for (let i = 0; i < antennas.length; i++) {
        const a = antennas[i];

        for (let j = 0; j < antennas.length; j++) {
            const b = antennas[j];

            if (a.antenna !== b.antenna || a.x === b.x || a.y === b.y) {
                continue;
            }

            const dx = Math.abs(a.x - b.x);
            const dy = Math.abs(a.y - b.y);

            let antinode: Antinode = {
                x: a.x > b.x ? b.x - dx : b.x + dx,
                y: a.y > b.y ? b.y - dy : b.y + dy
            };

            if (infinite) {
                while (withinGrid(antinode)) {
                    antinodes.add(`${antinode.x}:${antinode.y}`);

                    antinode = {
                        x: a.x > b.x ? antinode.x - dx : antinode.x + dx,
                        y: a.y > b.y ? antinode.y - dy : antinode.y + dy
                    };
                }
            } else {
                if (withinGrid(antinode)) {
                    antinodes.add(`${antinode.x}:${antinode.y}`);
                }
            }
        }
    }

    const otherAntennas = antennas.filter(
        (a) => !antinodes.has(`${a.x}:${a.y}`)
    );

    return { antinodes, otherAntennas };
}

const part1 = findAntinodes();
const part2 = findAntinodes(true);

console.log('part 1:', part1.antinodes.size);
console.log('part 2:', part2.antinodes.size + part2.otherAntennas.length);
