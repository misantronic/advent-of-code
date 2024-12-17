import { lines, readFile } from '../utils';

const input1 = readFile('./input-example.txt');
const input2 = readFile('./input.txt');

[input2].forEach((file) => {
    function run(newA?: bigint) {
        let [A, B, C, , program] = lines(file).map((line, i) => {
            if (i >= 0 && i <= 2) {
                return BigInt(line.match(/\d+/)?.[0]!);
            }

            if (i === 4) {
                return line.replace('Program: ', '').split(',').map(Number);
            }

            return undefined;
        }) as [bigint, bigint, bigint, undefined, number[]];

        if (newA) {
            A = newA;
        }

        // optcode: 0
        function adv(comboOperand: bigint) {
            A = A / 2n ** comboOperand;
        }

        // optcode: 1
        function bxl(literalOperand: bigint) {
            B = B ^ literalOperand;
        }

        // optcode: 2
        function bst(comboOperand: bigint) {
            B = comboOperand % 8n;
        }

        // optcode: 3
        function jnz() {
            if (A === 0n) return false;
            return true;
        }

        // optcode: 4
        function bxc() {
            B = B ^ C;
        }

        // optcode: 5
        function out(comboOperand: bigint) {
            return comboOperand % 8n;
        }

        // optcode: 6
        function bdv(comboOperand: bigint) {
            B = A / 2n ** comboOperand;
        }

        // optcode: 7
        function cdv(comboOperand: bigint) {
            C = A / 2n ** comboOperand;
        }

        const instructions = {
            0: adv,
            1: bxl,
            2: bst,
            3: jnz,
            4: bxc,
            5: out,
            6: bdv,
            7: cdv
        };

        const comboOperands = (operand: number) => {
            switch (operand) {
                case 0:
                case 1:
                case 2:
                case 3:
                    return operand;
                case 4:
                    return A;
                case 5:
                    return B;
                case 6:
                    return C;
                default:
                case 7:
                    return operand;
                // throw new Error('Invalid operand');
            }
        };
        let output: bigint[] = [];

        for (let i = 0; i < program.length; i += 2) {
            const opcode = program[i] as keyof typeof instructions;
            const operand = comboOperands(program[i + 1]);

            let fn = instructions[opcode];
            let fnRes = fn(BigInt(operand));

            if (opcode === 5 && typeof fnRes === 'bigint') {
                output.push(fnRes);
            }

            if (opcode === 3 && fnRes) {
                i = Number(BigInt(operand) - 2n);
                continue;
            }
        }

        return { program, output: output.join(',') };
    }

    function calcA(program: number[]) {
        return program.reduceRight((A, _, i) => {
            const partialProgram = program.slice(i).join(',');

            while (true) {
                const { output } = run(A);

                if (output === program.join(',')) {
                    return A;
                }

                if (output === partialProgram) {
                    break;
                }

                A++;
            }

            return A * 8n;
        }, 0n);
    }

    console.time('part 1');
    const { program, output } = run();

    console.log('part 1:', output);
    console.timeEnd('part 1');

    console.time('part 2');
    console.log('part 2:', calcA(program));
    console.timeEnd('part 2');
});
