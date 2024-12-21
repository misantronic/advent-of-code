import { lines, readFile } from '../utils';

const input1 = './input-example.txt';
const input2 = './input.txt';

[input1].forEach((name) => {
    // patterns can be [r, wr, b, g, bwu, rb, gb, br]
    // towels can be [brwrr, bggr, gbbr, rrbgbr]
    const [patterns, , ...towels] = lines(readFile(name)).map((line, i) => {
        if (i === 0) {
            return line.split(', ');
        }

        return line;
    }) as [string[], string, ...string[]];

    const totalMap = new Map<string, number>();

    towels.forEach((towel, i) => {
        const dfs = (towel: string, index: number, path: string[]) => {
            if (towel.substring(index) === '') {
                totalMap.set(towel, (totalMap.get(towel) || 0) + 1);

                return true;
            }

            for (const pattern of patterns) {
                if (towel.startsWith(pattern, index)) {
                    dfs(towel, index + pattern.length, [...path, pattern]);
                }
            }
        };

        dfs(towel, 0, []);
    });

    console.log(name, 'part 1', totalMap.size);
    console.log(
        name,
        'part 1',
        totalMap.values().reduce((a, b) => a + b, 0)
    );
});
