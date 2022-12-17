import { lines, readFile } from '../utils';

const input = lines(readFile('input-example.txt'));

interface RawValve {
    name: string;
    rate: number;
    valves: string[];
    open: boolean;
    visited: boolean;
}

const data = input.map<RawValve>((line) => {
    const matches =
        line.match(
            /^Valve (?<valve>\w{2}) has flow rate=(?<rate>\d+); tunnels* leads* to valves* (?<valves>.+)/
        )?.groups ?? {};

    const valve = matches.valve;
    const rate = Number(matches.rate);
    const valves = matches.valves.split(', ');

    return { name: valve, rate, valves, open: false, visited: false };
});

let currentValve = data[0].name;

function getValve(valve: string) {
    return data.find((e) => e.name === valve)!;
}

interface Tree {
    valve: string;
    children: Tree[];
}

const valve = getValve(currentValve);
