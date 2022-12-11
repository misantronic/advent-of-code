import { lines, readFile } from '../utils';

interface Point {
    x: number;
    y: number;
}

const input = lines(readFile('input-example.txt'));

const s = { x: 0, y: 0 };
const H = { x: s.x, y: s.y };
const knots = Array(3)
    .fill(0)
    .map(() => ({ x: s.x, y: s.y }));

function parseLine(line: string) {
    const parts = line.split(' ');
    const direction = parts[0] as 'R' | 'U' | 'L' | 'D';
    const num = Number(parts[1]);

    switch (direction) {
        case 'U':
            return { dx: 0, dy: num };
        case 'R':
            return { dx: num, dy: 0 };
        case 'D':
            return { dx: 0, dy: -num };
        case 'L':
            return { dx: -num, dy: 0 };
    }
}

const tVisited = new Set<string>();

function moveHead(head: Point, value: number, axis: 'x' | 'y') {
    head[axis] += value;
}

function moveTail(head: Point, tail: Point, value: number, axis: 'x' | 'y') {
    const a = axis;
    const b = axis === 'x' ? 'y' : 'x';

    // console.log('moveTail', { head, tail, value, axis });

    if (
        tail[a] !== head[a] &&
        (tail[b] === head[b] || Math.abs(head[a] - tail[a]) >= 2)
    ) {
        tail[a] = head[a] - value;
        tail[b] = head[b];
    }
}

input.map((line, i) => {
    if (i > 1) return;
    const { dx, dy } = parseLine(line);

    console.log('\n==', line, '==\n');

    (
        [
            { axis: 'x', value: dx },
            { axis: 'y', value: dy }
        ] as const
    ).forEach(({ axis, value }) => {
        for (let i = Math.min(0, value); i < Math.max(0, value); i++) {
            moveHead(H, Math.sign(value), axis);

            for (let k = 0; k < knots.length; k++) {
                moveTail(knots[k - 1] || H, knots[k], Math.sign(value), axis);

                if (k === knots.length - 1) {
                    tVisited.add(JSON.stringify(knots[k]));
                }
            }

            console.log('');
            console.log({ H, knots });
        }
    });
});

console.log('');
console.log(tVisited.size);
