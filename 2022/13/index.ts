import { lines, readFile } from '../utils';

const input = readFile('input.txt');

function compareNumbers(left: number, right: number) {
    const msg = `--> ${left} vs ${right}`;

    if (left === right) {
        // console.log(msg, 'equal');
        return undefined;
    }
    if (left < right) {
        // console.log(msg, 'smaller');
        return true;
    }
    // console.log(msg, 'bigger');
    return false;
}

function compare(
    left: number | number[] | number[][],
    right: number | number[] | number[][]
) {
    if (typeof left === 'number' && typeof right === 'number') {
        return compareNumbers(left, right);
    }

    if (typeof left === 'number') {
        left = [left];
    }

    if (typeof right === 'number') {
        right = [right];
    }

    const iMax = Math.max(left.length, right.length);

    let comparision: boolean | undefined;

    for (let i = 0; i < iMax; i++) {
        const leftItem = left[i] as number | number[] | undefined;
        const rightItem = right[i] as number | number[] | undefined;

        if (leftItem === undefined) {
            return true;
        }

        if (rightItem === undefined) {
            return false;
        }

        comparision = compare(leftItem, rightItem);

        if (comparision === true) {
            return true;
        }

        if (comparision === false) {
            return false;
        }
    }

    return comparision;
}

function getInput() {
    return input.split('\n\n').map((block) => {
        return lines(block).map<number[]>((line) => JSON.parse(line));
    });
}

function part1() {
    return getInput().reduce((sum, [left, right], i) => {
        const index = i + 1;

        // console.log(index);
        // console.log('compare', {
        //     a: JSON.stringify(left),
        //     b: JSON.stringify(right)
        // });

        if (compare(left, right)) {
            // console.log('-> true\n');
            return sum + index;
        }

        // console.log('');

        return sum;
    }, 0);
}

function part2() {
    const packetA = [[2]];
    const packetB = [[6]];

    const input = [...getInput().flat(), packetA, packetB].sort((a, b) =>
        compare(a, b) ? -1 : 1
    );

    const indexA = input.findIndex(
        (packet) => JSON.stringify(packet) === JSON.stringify(packetA)
    );
    const indexB = input.findIndex(
        (packet) => JSON.stringify(packet) === JSON.stringify(packetB)
    );

    return (indexA + 1) * (indexB + 1);
}

console.log('part 1:', part1());
console.log('part 2:', part2());
