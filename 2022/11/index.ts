import { lines, readFile } from '../utils';

const input = readFile('input.txt');

class Monkey {
    name: string;
    items: number[] = [];
    inspections = 0;

    private operationRaw: string;
    private testRaw: string;
    private testTrueRaw: string;
    private testFalseRaw: string;

    operation(item: number) {
        this.inspections++;

        const [_, operator, rawNum] =
            this.operationRaw.match(/(\*|\+) (\d+|old)$/)!;
        const num = rawNum === 'old' ? item : Number(rawNum);

        switch (operator as '*' | '+') {
            case '*':
                return item * num;
            case '+':
                return item + num;
        }
    }

    public get testDivisor() {
        return Number(this.testRaw.split('divisible by ').pop()!);
    }

    test(item: number) {
        const trueTarget = this.testTrueRaw.split('If true: throw to ').pop()!;
        const falseTarget = this.testFalseRaw
            .split('If false: throw to ')
            .pop()!;

        const success = item % this.testDivisor === 0;

        return {
            monkey: success ? trueTarget : falseTarget
        };
    }

    bore(item: number, divisor: number | null): number {
        return divisor === null
            ? item % this.testDivisor
            : Math.floor(item / divisor);
    }

    addItem(item: number) {
        this.items.push(item);
    }

    removeItem(item: number) {
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
            .map(Number);

        this.operationRaw = operationRaw;
        this.testRaw = testRaw;
        this.testTrueRaw = testTrueRaw;
        this.testFalseRaw = testFalseRaw;
    }
}

function iterateMonkeys(rounds: number, worryDivisor?: number) {
    const monkeys = input.split('\n\n').map((raw) => new Monkey(raw));

    const divider = monkeys
        .map((m) => m.testDivisor)
        .reduce((a, b) => a * b, 1);

    for (let round = 1; round <= rounds; round++) {
        monkeys.forEach((monkey) => {
            monkey.items.forEach((item) => {
                const opRes = monkey.operation(item);
                const boreRes = worryDivisor
                    ? Math.floor(item / worryDivisor)
                    : opRes % divider;
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
    const [top1, top2] = iterateMonkeys(20, 3).sort(
        (a, b) => b.inspections - a.inspections
    );

    console.log('part 1:', top1.inspections * top2.inspections);
}

function part2() {
    const [top1, top2] = iterateMonkeys(10000).sort(
        (a, b) => b.inspections - a.inspections
    );

    console.log('part 2:', top1.inspections * top2.inspections);
}

part1();
part2();
