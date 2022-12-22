import { lines, readFile } from '../utils';

const input = readFile('input.txt');

const [mazeRaw, instructions] = input.split('\n\n');

const initial = Number(instructions.match(/^\d+/));
const commands = (instructions.match(/[R|L]\d+/g) ?? []).map((str) => {
    const matches = str.match(/([R|L])(\d+)/);

    return [matches?.[1], Number(matches?.[2])] as ['R' | 'L', number];
});

type Direction = '>' | 'v' | '<' | 'ʌ';
type Char = ' ' | '.' | '#';
type Point = { x: number; y: number; char?: Char };

const dirMap: Direction[] = ['ʌ', '>', 'v', '<'];

const maze = lines(mazeRaw).reduce((memo, line, y) => {
    line.split('').map((char, x) => {
        memo.push({ x, y, char: char as Char });
    });

    return memo;
}, [] as Point[]);

const maxX = (y: number) =>
    maze.reduce((memo, p) => Math.max(memo, p.y === y ? p.x : 0), 0);
const maxY = (x: number) =>
    maze.reduce((memo, p) => Math.max(memo, p.x === x ? p.y : 0), 0);

function getPoint(p: Point) {
    return maze.find((item) => item.x === p.x && item.y === p.y);
}

function nextPosition(
    direction: Direction,
    add: number,
    current: Point
): Point {
    let resPoint: Point = { ...current };

    function getNextPoint(current: Point): Point | undefined {
        switch (direction) {
            case '>':
                return (
                    getPoint({ x: current.x + 1, y: current.y }) ??
                    getOverlapPoint(current)
                );
            case '<':
                return (
                    getPoint({ x: current.x - 1, y: current.y }) ??
                    getOverlapPoint(current)
                );
            case 'v':
                return (
                    getPoint({ x: current.x, y: current.y + 1 }) ??
                    getOverlapPoint(current)
                );
            case 'ʌ':
                return (
                    getPoint({ x: current.x, y: current.y - 1 }) ??
                    getOverlapPoint(current)
                );
        }
    }

    function getOverlapPoint(current: Point): Point {
        switch (direction) {
            case '>':
                return getPoint({ x: 0, y: current.y })!;
            case '<':
                return getPoint({ x: maxX(current.y), y: current.y })!;
            case 'v':
                return getPoint({ x: current.x, y: 0 })!;
            case 'ʌ':
                return getPoint({ x: current.x, y: maxY(current.x) })!;
        }
    }

    for (let i = 1; i <= add; i++) {
        let nextPoint = getNextPoint(resPoint);

        while (nextPoint?.char === ' ') {
            nextPoint = getNextPoint(nextPoint);
        }

        // console.log({ nextPoint });

        if (nextPoint?.char === '#') {
            return resPoint;
        }

        if (nextPoint?.char === '.') {
            resPoint = nextPoint;
        }
    }

    return resPoint;
}

function part1() {
    let position = maze.find((p) => p.char === '.')!;
    let direction = '>' as Direction;

    // initial
    position = nextPosition(direction, initial, position);

    commands.forEach(([rotation, value], i) => {
        direction = (() => {
            const dirIndex = dirMap.findIndex((d) => d === direction);

            switch (rotation) {
                case 'R': {
                    return dirMap.at(dirIndex + 1) ?? dirMap.at(0)!;
                }
                case 'L': {
                    return dirMap.at(dirIndex - 1) ?? dirMap.at(-1)!;
                }
            }
        })();

        position = nextPosition(direction, value, position);
    });

    console.log('\nfinal position', { position, direction });

    const column = (position.x + 1) * 4;
    const row = (position.y + 1) * 1000;
    const facing = (() => {
        switch (direction) {
            case 'ʌ':
                return 3;
            case '>':
                return 0;
            case 'v':
                return 1;
            case '<':
                return 2;
        }
    })();

    return row + column + facing;
}

console.time('part 1');
console.log('part 1', part1());
console.timeEnd('part 1');
