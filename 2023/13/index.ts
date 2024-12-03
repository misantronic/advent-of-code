import { lines, readFile } from '../utils';

const input = readFile('./input-example.txt').split('\n\n').map(lines);

const mapPattern = (arr: string[]) => {
    const numPattern: number[] = [];

    for (let i = 0; i < arr.length; i++) {
        const line = arr[i];

        for (let j = 0; j < arr.length; j++) {
            const line2 = arr[j];

            if (line === line2) {
                numPattern[i] = i;
                numPattern[j] = i;
            }
        }
    }

    return numPattern;
};

const getReflection = (pattern: number[]) => {
    let reflection = 0;
    const middle: number[] = [];

    // find middle
    for (let i = 0; i < pattern.length; i++) {
        const curr = pattern[i];
        const prev = pattern[i - 1];

        if (curr === prev) {
            middle.push(i - 1);
        }
    }

    // find reflection
    for (let i = 0; i < middle.length; i++) {
        const lIndex = middle[i];
        const rIndex = lIndex + 1;

        let len = 1;

        while (true) {
            const leftO = pattern[lIndex - len];
            const rightO = pattern[rIndex + len];

            if (leftO === rightO) {
                len++;
            } else {
                break;
            }
        }

        const lValue = lIndex + 1;

        if (lValue - len === 0 || rIndex + len === pattern.length) {
            reflection = lValue;
        }
    }

    return reflection;
};

const getPatterns = (yP: string[]) => {
    const xP: string[] = [];

    for (let i = 0; i < yP.length; i++) {
        yP[i].split('').map((char, j) => {
            if (!xP[j]) {
                xP[j] = '';
            }

            xP[j] = `${xP[j]}${char}`;
        });
    }

    const x = mapPattern(xP);
    const y = mapPattern(yP);

    return { x, y };
};

console.log(
    'part 1',
    input.reduce((p, yP) => {
        const { x, y } = getPatterns(yP);

        const xR = getReflection(x);
        const yR = getReflection(y);

        // console.log({ x, y, xR, yR });

        return p + xR + yR * 100;
    }, 0)
);
