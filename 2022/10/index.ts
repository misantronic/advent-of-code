import { lines, readFile } from '../utils';

const input = lines(readFile('input.txt'));

type Name = 'addx' | 'noop';
type Command = { name: 'addx'; val: number } | { name: 'noop' };

let registerX = [1];

const commandList = input.map<Command>((rawCmd) => {
    const name: Name = rawCmd.startsWith('addx') ? 'addx' : 'noop';
    const val = Number(rawCmd.split(' ')[1]);

    switch (name) {
        case 'addx':
            return { name, val };
        case 'noop':
            return { name };
    }
});

const ticks =
    1 +
    commandList.filter(({ name }) => name === 'noop').length +
    commandList.filter(({ name }) => name === 'addx').length * 2;

const queue: { command: Command; ticksLeft: number }[] = [];

function cycle(num: number, command?: Command) {
    let X = registerX.at(-1) ?? 0;
    const queueEntry = queue.at(0);

    if (queueEntry) {
        queueEntry.ticksLeft--;
    }

    if (queueEntry?.ticksLeft === 0 && queueEntry.command.name === 'addx') {
        registerX.push(X + queueEntry.command.val);

        queue.shift();
    }

    X = registerX.at(-1) ?? 0;

    const sprite = [X - 1, X, X + 1];
    const spriteIndex = num % 40;

    crtRows.push(sprite.includes(spriteIndex) ? '#' : '.');

    switch (command?.name) {
        case 'noop':
            break;
        case 'addx':
            queue.push({ command, ticksLeft: 1 });
            break;
    }

    return command?.name;
}

let lastCommand: Name | undefined;
let cmdIndex = 0;

const cycles = [20, 60, 100, 140, 180, 220];
const crtRows: string[] = [];

const sum = Array(ticks)
    .fill(0)
    .map((_, i) => i + 1)
    .reduce((sum, c) => {
        const currentX = registerX.at(-1) ?? 0;
        const command =
            lastCommand === 'addx' ? undefined : commandList[cmdIndex];

        if (cycles.includes(c)) {
            const strength = c * currentX;

            sum = sum + strength;
        }

        lastCommand = cycle(c, command);

        if (command) {
            cmdIndex++;
        }

        return sum;
    }, 0);

console.log('part 1:', sum);

const output: string[] = [];

for (let c = 0; c < crtRows.length; c++) {
    if (c % 40 === 0) {
        output.push('\n');
    }

    output.push(crtRows[c]);
}

console.log('part 2:', output.join(''));
