import { lines, readFile } from '../utils';

const input = readFile('./input.txt')
    .split('\n\n')
    .map(lines)
    .map<{ buttonA: P; buttonB: P; price: P }>(([buttonA, buttonB, price]) => {
        const match = (button: string): P => {
            return {
                x: +button.match(/X\+(\d+)/)?.[1]!,
                y: +button.match(/Y\+(\d+)/)?.[1]!
            };
        };

        const priceMatch = price.match(/X=(\d+), Y=(\d+)/)!;

        return {
            buttonA: match(buttonA),
            buttonB: match(buttonB),
            price: { x: +priceMatch?.[1]!, y: +priceMatch?.[2]! }
        };
    });

interface P {
    x: number;
    y: number;
}

const linearEquation = ({
    buttonA,
    buttonB,
    price
}: {
    buttonA: P;
    buttonB: P;
    price: P;
}) => {
    // linear equation
    const factor1 = buttonA.y / buttonA.x;
    const b = buttonB.y - factor1 * buttonB.x;
    const c = price.y - factor1 * price.x;

    const numB = Math.round((c / b) * 100) / 100;
    const numA = (price.x - buttonB.x * numB) / buttonA.x;

    if (numA % 1 === 0 && numB % 1 === 0) {
        return numA * 3 + numB * 1;
    }

    return 0;
};

console.time('part 1');
console.log(
    'part 1:',
    input.reduce((memo, machine) => memo + linearEquation(machine), 0)
);
console.timeEnd('part 1');

console.time('part 2');
console.log(
    'part 2:',
    input.reduce(
        (memo, machine) =>
            memo +
            linearEquation({
                ...machine,
                price: {
                    x: machine.price.x + 10000000000000,
                    y: machine.price.y + 10000000000000
                }
            }),
        0
    )
);
console.timeEnd('part 2');
