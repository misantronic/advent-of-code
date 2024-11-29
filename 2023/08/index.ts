import { lines, readFile } from '../utils';

const input1 = lines(readFile('./input.txt'));
const input2 = lines(readFile('./input.txt'));

const queue1 = input1[0].split('') as ('R' | 'L')[];
const map1 = input1.slice(2).reduce((map, line) => {
    const match = line.match(
        /^(?<S>[A-Z]{3}) = \((?<L>[A-Z]{3}), (?<R>[A-Z]{3})\)/
    );

    map.set(match?.groups?.S!, { L: match?.groups?.L!, R: match?.groups?.R! });

    return map;
}, new Map<string, { L: string; R: string }>());

const queue2 = input2[0].split('') as ('R' | 'L')[];
const map2 = input2.slice(2).reduce((map, line) => {
    const match = line.match(
        /^(?<S>[0-9A-Z]{3}) = \((?<L>[0-9A-Z]{3}), (?<R>[0-9A-Z]{3})\)/
    );

    map.set(match?.groups?.S!, { L: match?.groups?.L!, R: match?.groups?.R! });

    return map;
}, new Map<string, { L: string; R: string }>());

(() => {
    console.time('part 1');

    let steps = 0;
    let coord = 'AAA';
    const queueCopy = [...queue1];

    while (coord !== 'ZZZ') {
        const next = map1.get(coord)!;

        coord = next[queueCopy.shift()!];
        steps++;

        if (queueCopy.length === 0) {
            queueCopy.push(...queue1);
        }
    }

    console.log('part 1:', steps);
    console.timeEnd('part 1');
})();

console.log('');

(() => {
    console.time('part 2');

    const coords = [...map2.keys()].filter((key) => key.endsWith('A'));
    const allSteps: number[] = [];

    for (let i = 0; i < coords.length; i++) {
        let steps = 0;
        let coord = coords[i];
        const queueCopy = [...queue2];

        while (!coord.endsWith('Z')) {
            const next = map2.get(coord)!;

            coord = next[queueCopy.shift()!];
            steps++;

            if (queueCopy.length === 0) {
                queueCopy.push(...queue2);
            }
        }

        allSteps.push(steps);
    }

    const gcd = (a: number, b: number): number => {
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return a;
    };

    const lcm = (a: number, b: number): number => {
        return (a * b) / gcd(a, b);
    };

    const lcmOfArray = (arr: number[]): number => {
        return arr.reduce((acc, val) => lcm(acc, val), 1);
    };

    const steps = lcmOfArray(allSteps);

    console.log('part 2:', steps);
    console.timeEnd('part 2');
})();
