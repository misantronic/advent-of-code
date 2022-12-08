import { readFileSync } from 'fs';

const pwd = process.argv[1];
const inputExample = readFileSync(`${pwd}/input-example.txt`, 'utf-8');
const input = readFileSync(`${pwd}/input.txt`, 'utf-8');

const grid = input
    .split('\n')
    .map((line) => line.split('').map((tree) => parseInt(tree)));

const visibilityMap = grid.map((row, y) => {
    return row.map((tree, x) => {
        const edge =
            x === 0 || y === 0 || x === row.length - 1 || y === grid.length - 1;

        const value = tree;

        return { edge, value };
    });
});

function getEdges(x, y) {
    const top = [];
    const right = [];
    const bottom = [];
    const left = [];

    for (let i = y - 1; i >= 0; i--) {
        top.push(visibilityMap[i][x].value);
    }
    for (let i = x + 1; i < visibilityMap[y].length; i++) {
        right.push(visibilityMap[y][i].value);
    }
    for (let i = y + 1; i < visibilityMap[y].length; i++) {
        bottom.push(visibilityMap[i][x].value);
    }
    for (let i = x - 1; i >= 0; i--) {
        left.push(visibilityMap[y][i].value);
    }

    return {
        top,
        right,
        bottom,
        left
    };
}

function countVisibleTrees() {
    return visibilityMap.reduce((memo, row, y) => {
        row.forEach((tree, x) => {
            if (tree.edge) {
                memo += 1;
                return;
            }

            const edges = getEdges(x, y);

            /** @type {'top'|'right'|'bottom'|'left'} */
            let direction;

            for (direction of ['top', 'right', 'bottom', 'left']) {
                const edgeTrees = edges[direction];

                if (edgeTrees.every((edge) => tree.value > edge)) {
                    memo += 1;
                    break;
                }
            }
        });

        return memo;
    }, 0);
}

function calculateScenicView() {
    return visibilityMap.reduce((memo, row, y) => {
        const scores = row.map((tree, x) => {
            if (tree.edge) {
                return 0;
            }

            const edges = getEdges(x, y);

            /** @type {'top'|'right'|'bottom'|'left'} */
            let direction;
            /** @type {number[]} */
            const trees = [];

            for (direction of ['top', 'right', 'bottom', 'left']) {
                const edgeTrees = (() => {
                    let cnt = 0;

                    for (const edgeTree of edges[direction]) {
                        if (edgeTree < tree.value) {
                            cnt++;
                            continue;
                        }

                        if (edgeTree >= tree.value) {
                            cnt++;
                            break;
                        }
                    }

                    return cnt;
                })();

                trees.push(edgeTrees);
            }

            return trees.reduce((a, b) => a * b, 1);
        });

        return Math.max(...scores, memo);
    }, 0);
}

console.log('part 1:', countVisibleTrees());
console.log('part 2:', calculateScenicView());
