import { lines, readFile } from '../utils';

const input = lines(readFile('input-example.txt'));

function fromSnafu(value: number) {
    switch (value) {
        case 1:
            return 1;
        case 2:
            return 2;
    }
}
