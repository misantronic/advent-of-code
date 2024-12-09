import { readFile } from '../utils';

const input = readFile('./input.txt').split('');

function findBlocks() {
    const blocks: (number | undefined)[] = [];
    let id = 0;

    for (let i = 0; i < input.length; i += 2) {
        const blockFile = parseInt(input[i]);
        const blocksOfFreeSpace = parseInt(input[i + 1]);

        for (let j = 0; j < blockFile; j++) {
            blocks.push(id);
        }
        if (!isNaN(blocksOfFreeSpace)) {
            for (let j = 0; j < blocksOfFreeSpace; j++) {
                blocks.push(undefined);
            }
        }

        id++;
    }

    return blocks;
}

function sort1(blocks: (number | undefined)[]) {
    const newBlocks = [...blocks];

    outer: for (let i = newBlocks.length - 1; i >= 0; i--) {
        const file = newBlocks[i];

        if (file === undefined) {
            continue;
        }

        for (let j = 0; j < newBlocks.length; j++) {
            const freeSpace = newBlocks[j];

            if (freeSpace === undefined) {
                newBlocks[j] = file;
                newBlocks[i] = freeSpace;
                continue outer;
            }
        }
    }

    return [...newBlocks.slice(1), undefined];
}

function sort2(blocks: (number | undefined)[]) {
    const newBlocks = [...blocks];

    let curFile: number[] = [];

    for (let i = blocks.length - 1; i >= 0; i--) {
        const file = blocks[i];

        if (file === undefined || file === 0) {
            continue;
        }

        curFile.push(file);

        if (blocks[i - 1] !== file) {
            let numUndefined = 0;

            for (let j = 0; j < newBlocks.length; j++) {
                if (newBlocks[j] === undefined) {
                    numUndefined++;

                    if (numUndefined === curFile.length && j < i) {
                        newBlocks.splice(
                            j - curFile.length + 1,
                            curFile.length,
                            ...curFile
                        );

                        newBlocks.splice(
                            i,
                            curFile.length,
                            ...Array(curFile.length).fill(undefined)
                        );
                        break;
                    }
                } else {
                    numUndefined = 0;
                }
            }

            curFile = [];
        }
    }

    return newBlocks;
}

console.time('part 1');
console.log(
    'part 1:',
    sort1(findBlocks()).reduce(
        (sum: number, block, i) => (block ? sum + i * block : sum),
        0
    )
);
console.timeEnd('part 1');

console.time('part 2');
const sorted = sort2(findBlocks());

console.log(
    'part 2:',
    sorted.reduce((sum: number, block, i) => (block ? sum + i * block : sum), 0)
);
console.timeEnd('part 2');
