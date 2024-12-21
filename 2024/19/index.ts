import { lines, readFile } from '../utils';

const input1 = './input-example.txt';
const input2 = './input.txt';

[input2].forEach((name) => {
    // patterns can be [r, wr, b, g, bwu, rb, gb, br]
    // towels can be [brwrr, bggr, gbbr, rrbgbr]
    const [patterns, , ...towels] = lines(readFile(name)).map((line, i) => {
        if (i === 0) {
            return line.split(', ');
        }

        return line;
    }) as [string[], string, ...string[]];

    const totalMap = new Map<string, number>();
    const memo = new Map<string, number>();

    towels.forEach((towel, i) => {
        const dfs = (towel: string, index: number): number => {
            if (index === towel.length) {
                return 1;
            }

            const key = `${towel}-${index}`;
            if (memo.has(key)) {
                return memo.get(key)!;
            }

            let count = 0;
            for (const pattern of patterns) {
                if (towel.startsWith(pattern, index)) {
                    count += dfs(towel, index + pattern.length);
                }
            }

            memo.set(key, count);
            return count;
        };

        const count = dfs(towel, 0);
        totalMap.set(towel, count);
    });

    console.log(name, 'part 1', totalMap.size);
    console.log(
        name,
        'part 1',
        Array.from(totalMap.values()).reduce((a, b) => a + b, 0)
    );
});
