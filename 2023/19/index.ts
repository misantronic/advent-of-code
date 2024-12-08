import { lines, readFile } from '../utils';

const [rawWorkflows, rawRatings] = readFile('./input.txt')
    .split('\n\n')
    .map(lines);

const ruleNumbers = rawWorkflows
    .flatMap((workflow) => workflow.match(/\d+/g) ?? [])
    .map(Number)
    .flatMap((num) => [num - 1, num + 1])
    .sort((a, b) => a - b);

const workflows = rawWorkflows.map((workflow) => {
    const match = workflow.match(/^(\w+)\{(.+)\}$/);

    return {
        name: match?.[1],
        rules:
            match?.[2].split(',').map((rawRule) => {
                return (ratings: Record<'x' | 'm' | 'a' | 's', number>) => {
                    if (rawRule.includes(':')) {
                        const [condition, target] = rawRule.split(':');
                        const evalCondition = Object.entries(ratings).reduce(
                            (acc, [key, value]) => {
                                return acc.replace(key, value.toString());
                            },
                            condition
                        );

                        return eval(evalCondition) ? target : false;
                    }

                    return rawRule;
                };
            }) ?? []
    };
});

const ratings = rawRatings.map((rating) => {
    const match = rating.match(/^\{(.+)\}$/);

    return match?.[1].split(',').reduce((acc, rawRating) => {
        const [name, value] = rawRating.split('=');

        return { ...acc, [name]: Number(value) };
    }, {} as Record<'x' | 'm' | 'a' | 's', number>)!;
});

const findWorkflow = (name: string) => {
    return workflows.find((workflow) => workflow.name === name)!;
};

const findScore = (rating: Record<'x' | 'm' | 'a' | 's', number>) => {
    let currentWorkflow = 'in';
    let score = 0;

    loop: while (true) {
        const { rules } = findWorkflow(currentWorkflow);

        for (let j = 0; j < rules.length; j++) {
            const workflowResult = rules[j](rating);

            if (workflowResult === 'A') {
                Object.values(rating).forEach((value) => {
                    score += value;
                });
            }

            if (workflowResult === 'A' || workflowResult === 'R') {
                break loop;
            } else if (workflowResult) {
                currentWorkflow = workflowResult;
                break;
            }
        }
    }

    return score;
};

console.log(
    'part 1:',
    ratings.reduce((acc, rating) => acc + findScore(rating), 0)
);

console.time('part 2');
let combinations = 0;

ruleNumbers.forEach((x) => {
    ruleNumbers.forEach((m) => {
        ruleNumbers.forEach((a) => {
            ruleNumbers.forEach((s) => {
                const score = findScore({ x, m, a, s });

                if (score > 0) {
                    combinations++;
                }
            });
        });
    });
});

console.log('part 2:', combinations);
console.timeEnd('part 2');
