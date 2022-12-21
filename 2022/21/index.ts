import { lines, readFile } from '../utils';

const input = lines(readFile('input-example.txt'));

interface MonkeyOp {
    name: string;
    op: string | number;
}

function isNumber(val: any): val is number {
    return isFinite(val);
}
function parseInput() {
    return input.map<MonkeyOp>((line) => {
        const [name, op] = line.split(': ');

        return { name, op };
    });
}

let monkeys: { [key: string]: number } = {};
let list = parseInput();

function processValue(name: string, value: string | number) {
    if (isNumber(value)) {
        monkeys[name] = Number(value);
    } else {
        const { left, right, op } =
            value.match(/(?<left>\w+) (?<op>[-+*/=]) (?<right>\w+)/)?.groups ??
            {};

        const valLeft = processMonkey(left);
        const valRight = processMonkey(right);

        if (op === '=') {
            console.log(`${name}:`, left, op, right, valLeft, valRight);
            // monkeys[name] = monkeys[valLeft] ?? monkeys[valRight];
        } else {
            monkeys[name] = eval(`${valLeft} ${op} ${valRight}`);
        }
    }

    return monkeys[name];
}

function processMonkey(name: string) {
    const entry = list.find((entry) => entry.name === name)!;

    return processValue(entry.name, entry.op);
}

function part1() {
    monkeys = {};
    list = parseInput();

    return processMonkey('root');
}

function part2() {
    monkeys = {};
    list = parseInput();

    const rootEntry = list.find((entry) => entry.name === 'root')!;

    if (!isNumber(rootEntry.op)) {
        const [left, right] = rootEntry.op.split(' + ');

        const leftVal = processMonkey(left);
        const rightVal = processMonkey(right);

        console.log({ leftVal, rightVal });
    }
}

console.time('part 1');
console.log('part 1:', part1());
console.timeEnd('part 1');

console.time('part 2');
console.log('part 2:', part2());
console.timeEnd('part 2');
// 329443271231550 too high
