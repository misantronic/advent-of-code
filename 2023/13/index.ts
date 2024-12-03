import { lines, readFile } from '../utils';

const input = readFile('./input-example.txt').split('\n\n').map(lines);

const findPattern = (arr: string[]) => {
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
    const reflection: number[] = [];

    for (let i = 0; i < pattern.length; i++) {
        const curr = pattern[i];

        if (curr === 0) {
            continue;
        }

        if (reflection.length === 0) {
            reflection.push(curr);
        } else {
            const prev = pattern[pattern.length - 1];

            if (prev <= curr) {
                reflection.push(curr);
            }
        }
    }

    return reflection;
};

console.log(
    'part 1',
    input.reduce((acc, yPatternArr) => {
        const xPatternArr: string[] = [];

        for (let i = 0; i < yPatternArr.length; i++) {
            yPatternArr[i].split('').map((char, j) => {
                if (!xPatternArr[j]) {
                    xPatternArr[j] = '';
                }

                xPatternArr[j] = `${xPatternArr[j]}${char}`;
            });
        }

        const xPattern = findPattern(xPatternArr);
        const yPattern = findPattern(yPatternArr);

        const xReflection = getReflection(xPattern);
        const yReflection = getReflection(yPattern);

        console.log('x', xPattern, xReflection);
        console.log('y', yPattern, yReflection);
        console.log('--');

        if (xReflection.length > yReflection.length) {
            return acc + xReflection.length;
        }

        return acc + yReflection.length * 100;
    }, 0)
);

// 36324 too low
// 38577 too high
