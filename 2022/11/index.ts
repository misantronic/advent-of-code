import { lines, readFile } from '../utils';

const input = readFile('input-example.txt');

class Monkey {
    name: string;
    items: bigint[] = [];
    inspections = 0;

    private operationRaw: string;
    private testRaw: string;
    private testTrueRaw: string;
    private testFalseRaw: string;

    operation(item: bigint) {
        this.inspections++;

        const [_, operator, rawNum] =
            this.operationRaw.match(/(\*|\+) (\d+|old)$/)!;
        const num = BigInt(rawNum === 'old' ? item : Number(rawNum));

        switch (operator as '*' | '+') {
            case '*':
                return item * num;
            case '+':
                return item + num;
        }
    }

    test(item: bigint) {
        const divisor = BigInt(this.testRaw.split('divisible by ').pop()!);
        const trueTarget = this.testTrueRaw.split('If true: throw to ').pop()!;
        const falseTarget = this.testFalseRaw
            .split('If false: throw to ')
            .pop()!;

        const level = item / divisor;
        const success = item % divisor === 0n;

        return {
            level,
            success,
            monkey: success ? trueTarget : falseTarget
        };
    }

    bore(item: bigint, divisor: bigint): bigint {
        return divisor === 1n ? item : item / divisor;
    }

    addItem(item: bigint) {
        this.items.push(item);
    }

    removeItem(item: bigint) {
        this.items = this.items.filter((x) => x !== item);
    }

    constructor(raw: string) {
        const [
            name,
            itemsRaw,
            operationRaw,
            testRaw,
            testTrueRaw,
            testFalseRaw
        ] = lines(raw);

        this.name = name.replace(/:$/, '').toLowerCase();
        this.items = (itemsRaw.split('Starting items: ').pop() ?? '')
            .split(', ')
            .map(BigInt);

        this.operationRaw = operationRaw;
        this.testRaw = testRaw;
        this.testTrueRaw = testTrueRaw;
        this.testFalseRaw = testFalseRaw;
    }
}

function iterateMonkeys(rounds: number, worryDivisor: bigint) {
    const monkeys = input.split('\n\n').map((raw) => new Monkey(raw));

    for (let round = 1; round <= rounds; round++) {
        console.log('round', round);

        monkeys.forEach((monkey) => {
            monkey.items.forEach((item) => {
                const opRes = monkey.operation(item);
                const boreRes = monkey.bore(opRes, worryDivisor);
                const testRes = monkey.test(boreRes);

                const target = monkeys.find((m) => m.name === testRes.monkey);

                monkey.removeItem(item);
                target?.addItem(boreRes);
            });
        });
    }

    return monkeys;
}

function part1() {
    const [top1, top2] = iterateMonkeys(20, 3n).sort(
        (a, b) => b.inspections - a.inspections
    );

    console.log('part 1:', top1.inspections * top2.inspections);
}

function part2() {
    const monkeys = iterateMonkeys(20, 1n);

    console.log(monkeys);
}

part1();
part2();
