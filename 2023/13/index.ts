import { lines, readFile } from '../utils';

const input = readFile('./input.txt').split('\n\n').map(lines);

const getReflection = (pattern: string[]) => {
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

console.time('part 1');
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
console.timeEnd('part 1');

console.time('part 2');
console.log(
    'part 2',
    input.reduce((p, yP, i) => {
        const p1Reflections = reflections.get(i) ?? { x: 0, y: 0 };

        let xR = 0;
        let yR = 0;

        loop: for (let j = 0; j < yP.length; j++) {
            const line = yP[j];

            for (let k = 0; k < line.length; k++) {
                const yP2 = [...yP];

                yP2[j] =
                    line.substring(0, k) +
                    (line[k] === '.' ? '#' : '.') +
                    line.substring(k + 1);

                const { x, y } = getPatterns(yP2);

                const newXR = getReflection(x);
                const newYR = getReflection(y);

                if (newXR !== p1Reflections.x) {
                    xR = newXR;
                }

                if (newYR !== p1Reflections.y) {
                    yR = newYR;
                }

                if (xR !== 0 || yR !== 0) {
                    break loop;
                }
            }
        }

        if (xR === 0 && yR === 0) {
            xR = p1Reflections.x;
            yR = p1Reflections.y;
        }

        return p + xR + yR * 100;
    }, 0)
);
console.timeEnd('part 2');

// 34645 too low
// 52686 too high
