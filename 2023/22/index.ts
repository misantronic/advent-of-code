import { lines, readFile } from '../utils';

const grid = lines(readFile('./input-example.txt')).map((line) =>
    line.split(',')
);

console.log(grid);
