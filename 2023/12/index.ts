import { lines, readFile } from '../utils';

const input = lines(readFile('./input-example.txt'));

input.map((line, i) => {
    if (i !== 2) {
        return;
    }

    const [map, coords] = line.split(' ').map((str, i) => {
        if (i === 0) {
            return str;
        }

        if (i === 1) {
            return str.split(',').map(Number);
        }

        throw new Error('Invalid input');
    }) as [string, number[]];

    const splitMap = map.split('');

    console.log('--');
});
