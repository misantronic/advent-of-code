import { readFileSync } from 'fs';

export function readFile(file: string) {
    const pwd = process.argv[1];

    return readFileSync(`${pwd.replace(/index\.ts$/, '')}/${file}`, 'utf-8');
}

export function lines(input: string) {
    return input.trim().split('\n');
}
