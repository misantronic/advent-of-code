import { lines, readFile } from '../utils';

const input1 = './input-example.txt';
const input2 = './input.txt';

[input1, input2].forEach((name) => {
    const [patterns, , ...towels] = lines(readFile(name)).map((line, i) => {
        if (i === 0) {
            return line.split(', ');
        }

        return line;
    }) as [string[], string, ...string[]];

    const validTowels = towels.filter((towel, i) => {
        const memo: { [key: number]: boolean } = {};

        const dfs = (towel: string, index: number): boolean => {
            if (index in memo) return memo[index];
            if (index === towel.length) return true;

            for (const pattern of patterns) {
                if (towel.startsWith(pattern, index)) {
                    if (dfs(towel, index + pattern.length)) {
                        memo[index] = true;
                    }
                }
            }

            if (!memo[index]) {
                memo[index] = false;
            }

            return memo[index];
        };

        if (dfs(towel, 0)) {
            return true;
        }

        return false;
    });

    console.log(name, 'part 1', validTowels.length);
});
