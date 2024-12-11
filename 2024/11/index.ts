import { readFile } from '../utils';

const input = readFile('./input.txt').split(' ').map(Number);

function stoner(maxBlinks: number) {
    let stoneCounts = new Map<number, number>();

    for (const stone of input) {
        stoneCounts.set(stone, 1);
    }

    let blinks = 0;

    while (blinks < maxBlinks) {
        const newStoneCounts = new Map<number, number>();

        for (const [stone, count] of stoneCounts) {
            const strStone = `${stone}`;

            if (stone === 0) {
                newStoneCounts.set(1, (newStoneCounts.get(1) || 0) + count);
            } else if (strStone.length % 2 === 0) {
                const half = strStone.length / 2;
                const leftStone = parseInt(strStone.substring(0, half));
                const rightStone = parseInt(strStone.substring(half));

                newStoneCounts.set(
                    leftStone,
                    (newStoneCounts.get(leftStone) || 0) + count
                );
                newStoneCounts.set(
                    rightStone,
                    (newStoneCounts.get(rightStone) || 0) + count
                );
            } else {
                const newStone = stone * 2024;

                newStoneCounts.set(
                    newStone,
                    (newStoneCounts.get(newStone) || 0) + count
                );
            }
        }

        stoneCounts = newStoneCounts;
        blinks++;
    }

    return stoneCounts.values().reduce((acc, count) => acc + count, 0);
}

console.time('part 1');
console.log('part 1:', stoner(25));
console.timeEnd('part 1');

console.time('part 2');
console.log('part 2:', stoner(75));
console.timeEnd('part 2');
