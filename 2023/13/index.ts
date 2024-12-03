import { lines, readFile } from '../utils';

const input = readFile('./input-example.txt').split('\n\n').map(lines);

const getReflection = (pattern: (string | number)[]) => {
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

    return { x: xP, y: yP };
};

const reflections = new Map<number, { x: number; y: number }>();

console.log(
    'part 1',
    input.reduce((p, yP, i) => {
        const { x, y } = getPatterns(yP);

        const xR = getReflection(x);
        const yR = getReflection(y);

        reflections.set(i, { x: xR, y: yR });

        return p + xR + yR * 100;
    }, 0)
);

console.log(
    'part 2',
    input.reduce((p, yP, i) => {
        const { x, y } = getPatterns(yP);

        // get original reflection and exclude it
        const p1Reflections = reflections.get(i);

        const xR = getReflection(x);
        const yR = getReflection(y);

        const xR2 = xR === p1Reflections?.x ? 0 : xR;
        const yR2 = yR === p1Reflections?.y ? 0 : yR;

        // console.log({ x, y, xR, yR });

        return p + xR2 + yR2 * 100;
    }, 0)
);
