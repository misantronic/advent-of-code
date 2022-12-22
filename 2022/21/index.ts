import { lines, readFile } from '../utils';

const input = lines(readFile('input.txt'));

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
let formular: (string | number)[][] = [];

function processValue(name: string, value: string | number) {
    if (isNumber(value)) {
        monkeys[name] = Number(value);
    } else {
        const { left, right, op } =
            value.match(/(?<left>\w+) (?<op>[-+*/=]) (?<right>\w+)/)?.groups ??
            {};

        const valLeft = processMonkey(left);
        const valRight = processMonkey(right);

        formular.push([
            left === 'humn' ? left : valLeft,
            op,
            right === 'humn' ? right : valRight
        ]);

        monkeys[name] = eval(`${valLeft} ${op} ${valRight}`);
    }

    return monkeys[name];
}

function processMonkey(name: string) {
    const entry = list.find((entry) => entry.name === name)!;

    return processValue(entry.name, entry.op);
}

function printFormular(formular: (string | number)[][]) {
    return formular
        .reduce((memo, val, i) => {
            if (val.includes('humn')) {
                return [['(', ...val, ')'].join(' ')];
            }

            if (i === 0) {
                return [...memo, ['(', ...val, ')'].join(' ')];
            }

            return [...memo, val.slice(1).join(' ')];
        }, [])
        .map((val, i, arr) => {
            if (i === 0) {
                const brackets = Array(arr.length - 1)
                    .fill('(')
                    .join('');

                return `${brackets}${val}`;
            }

            return `${val})`;
        })
        .join(' ');
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

    if (isNumber(rootEntry.op)) {
        return;
    }

    const [left, right] = rootEntry.op.split(' + ');

    formular = [];

    processMonkey(left);

    const formA = printFormular(formular);

    formular = [];

    processMonkey(right);

    const formB = printFormular(formular);

    return `${formA} = ${formB}`;
}

console.time('part 1');
console.log('part 1:', part1());
console.timeEnd('part 1');

console.time('part 2');
console.log('part 2:', part2());
console.timeEnd('part 2');
// 329443271231550 too high
