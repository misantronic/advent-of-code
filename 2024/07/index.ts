import { lines, readFile } from '../utils';

const equations = lines(readFile('./input.txt')).map((line) => {
    const raw = line.split(': ');

    return {
        result: Number(raw[0]),
        input: raw[1].split(' ').map(Number)
    };
});

const calc = (operators: ['+', '*', '||'] | ['+', '*']) => {
    return equations.reduce((total, equation) => {
        const { input, result } = equation;

        const inputQueue: number[] = [...input];
        let stack: number[] = [inputQueue.shift()!];

        while (inputQueue.length) {
            const currentInput = inputQueue.shift()!;

            stack = stack.reduce<number[]>((acc, stackValue) => {
                operators.forEach((op) => {
                    if (op === '+') {
                        const sum = stackValue + currentInput;

                        acc.push(sum);
                    }

                    if (op === '*') {
                        const prod = stackValue * currentInput;

                        acc.push(prod);
                    }

                    if (op === '||') {
                        const concat = Number(`${stackValue}${currentInput}`);

                        acc.push(concat);
                    }
                });

                return acc;
            }, []);
        }

        return stack.includes(result) ? total + result : total;
    }, 0);
};

console.time('part 1');
console.log('part 1:', calc(['+', '*']));
console.timeEnd('part 1');

console.time('part 2');
console.log('part 2:', calc(['+', '*', '||']));
console.timeEnd('part 2');
