import { lines, readFile } from '../utils';

const [rawRules, rawUpdates] = readFile('./input.txt').split('\n\n').map(lines);

const rules = rawRules.map(
    (rule) => rule.split('|').map(Number) as [number, number]
);
const updates = rawUpdates.map((update) => update.split(',').map(Number));

const validUpdate = (update: number[]) => {
    for (let i = 0; i < update.length; i++) {
        const pageNum = update[i];
        const prevPageNum = update[i - 1];

        if (!prevPageNum) {
            continue;
        }

        const breakRule = rules.find(
            ([ruleA, ruleB]) => ruleA === pageNum && ruleB === prevPageNum
        );

        if (breakRule) {
            return false;
        }
    }

    return true;
};

const sumUpdate = (num: number, update: number[]) => {
    const i = Math.floor(update.length / 2);

    return num + update[i];
};

const validUpdates = updates.filter((update) => validUpdate(update));
const invalidUpdates = updates.filter((update) => !validUpdate(update));

console.log('part 1:', validUpdates.reduce(sumUpdate, 0));

console.log(
    'part 2:',
    invalidUpdates
        .map((update) => {
            return [...update].sort((a, b) => {
                const breakRule = rules.find(
                    ([ruleA, ruleB]) => ruleA === a && ruleB === b
                );

                return breakRule ? -1 : 0;
            });
        })
        .reduce(sumUpdate, 0)
);
