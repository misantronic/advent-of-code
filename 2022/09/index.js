import { readFileSync } from 'fs';

const pwd = process.argv[1];
const input = readFileSync(`${pwd}/input.txt`, 'utf-8');

const s = [0, 0];
const p = {
    H: [s[0], s[0]],
    T: [s[0], s[0]]
};

/**
 * @param {['R'|'U'|'L'|'D', string]} param0
 */
function mapDir([dir, rawNum]) {
    const num = Number(rawNum);

    switch (dir) {
        case 'R':
            return [num, 0];
        case 'U':
            return [0, num];
        case 'L':
            return [-num, 0];
        case 'D':
            return [0, -num];
    }
}

const tVisits = new Set();

function isCover() {
    return p.H[0] === p.T[0] && p.H[1] === p.T[1];
}

function addVisit() {
    tVisits.add(String(p.T));
}

function log() {
    console.log(p, isCover() ? 'cover' : '');
}

/**
 * @param {[number; dy: number]} dirs
 */
function moveBy([dx, dy]) {
    [dx, dy].forEach((dir, xOrY) => {
        const maxI = Math.abs(dir);

        const a = xOrY;
        const b = xOrY === 1 ? 0 : 1;

        for (let i = 1; i <= maxI; i++) {
            const add = Math.sign(dir);

            p.H[a] += add;

            if (!isCover()) {
                if (p.T[b] === p.H[b] || Math.abs(p.H[a] - p.T[a]) >= 2) {
                    p.T[a] = p.H[a] - add;
                    p.T[b] = p.H[b];
                }
            }

            addVisit();
            log();
        }
    });
}

function draw() {
    /** @type {[number, number][]} coord */
    const coord = [...tVisits].map((raw) => raw.split(',').map(Number));

    const minX = Math.min(...coord.map(([x]) => x));
    const maxX = Math.max(...coord.map(([x]) => x));
    const minY = Math.min(...coord.map(([, y]) => y));
    const maxY = Math.max(...coord.map(([, y]) => y));
    const output = [];

    for (let y = minY; y <= maxY; y++) {
        const str = [];
        for (let x = minX; x <= maxX; x++) {
            const found = coord.find(
                ([coordX, coordY]) => coordX === x && coordY === y
            );

            if (found?.[0] === s[0] && found?.[1] == s[1]) {
                str.push('s');
            } else {
                str.push(found ? '#' : '.');
            }
        }
        output.push(str.join(''));
    }

    console.log(output.reverse().join('\n'));
}

console.log('==', 'initial state', '==');
console.log('');

log();

if (isCover()) {
    addVisit();
}

console.log('');

input.split('\n').forEach((line) => {
    const dir = mapDir(line.split(' '));

    console.log('==', line, '==');
    console.log('');
    moveBy(dir);
    console.log('');
});

console.log(tVisits);
console.log('T visits:', tVisits.size);

draw();
