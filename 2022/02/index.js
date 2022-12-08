import { readFileSync } from 'fs';

const pwd = process.argv[1];
const input = readFileSync(`${pwd}/input.txt`, 'utf-8');

function bySign(you) {
    switch (you) {
        case 'A':
        case 'X':
            return 1;
        case 'B':
        case 'Y':
            return 2;
        case 'C':
        case 'Z':
            return 3;
    }
}

function byState(state) {
    switch (state) {
        case 'X': // lose
            return 0;
        case 'Y': // draw
            return 3;
        case 'Z': // win
            return 6;
    }
}

function getYou(op, state) {
    switch (op) {
        case 'A':
            switch (state) {
                case 'X': // lose
                    return 'C';
                case 'Y': // draw
                    return 'A';
                case 'Z': // win
                    return 'B';
            }
        case 'B':
            switch (state) {
                case 'X': // lose
                    return 'A';
                case 'Y': // draw
                    return 'B';
                case 'Z': // win
                    return 'C';
            }
        case 'C':
            switch (state) {
                case 'X': // lose
                    return 'B';
                case 'Y': // draw
                    return 'C';
                case 'Z': // win
                    return 'A';
            }
    }
}

function part1(op, you) {
    switch (you) {
        case 'X':
            switch (op) {
                case 'A':
                    return 3;
                case 'B':
                    return 0;
                case 'C':
                    return 6;
            }
        case 'Y':
            switch (op) {
                case 'A':
                    return 6;
                case 'B':
                    return 3;
                case 'C':
                    return 0;
            }
        case 'Z':
            switch (op) {
                case 'A':
                    return 0;
                case 'B':
                    return 6;
                case 'C':
                    return 3;
            }
    }
}

console.log(
    input.split('\n').reduce((memo, line) => {
        const [op, you] = line.split(' ');
        const base = bySign(you);

        return memo + part1(op, you) + base;
    }, 0)
);

console.log(
    input.split('\n').reduce((memo, line) => {
        const [op, state] = line.split(' ');
        const you = getYou(op, state);
        const base = bySign(you);

        return memo + byState(state) + base;
    }, 0)
);
