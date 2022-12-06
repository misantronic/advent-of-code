import { readFileSync } from 'fs';

const pwd = process.argv[1];
const inputStacks = readFileSync(`${pwd}/input-stacks.txt`, 'utf-8');
const inputCmd = readFileSync(`${pwd}/input-cmd.txt`, 'utf-8');

let stacks = [];

inputStacks
    .split('\n')
    .map((row) => row.replace(/    /g, ' [0]'))
    .map((row) => row.replace(/\[|\]/g, ''))
    .map((row) => row.split(' '))
    .map((row) => row.map((col) => (col === '0' ? null : col)))
    .map((col, i) =>
        col.map((char, j) => {
            stacks[j] = stacks[j] || [];
            stacks[j][i] = stacks[j][i] || [];

            stacks[j][i] = char;
        })
    );

stacks = stacks.map((col) => col.filter(Boolean));

inputCmd.split('\n').map((cmdRaw) => {
    const cmd = cmdRaw.match(/move (\d+) from (\d+) to (\d+)/);
    const num = parseInt(cmd[1]);
    const from = parseInt(cmd[2]) - 1;
    const to = parseInt(cmd[3]) - 1;

    const values = [];

    for (let i = 0; i < num; i++) {
        const val = stacks[from].shift();

        values.push(val);
    }

    stacks[to].unshift(...values);
});

// part 2
console.log(stacks.map((col) => col[0]));
