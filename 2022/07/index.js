import { readFileSync } from 'fs';

const pwd = process.argv[1];
const inputExample = readFileSync(`${pwd}/input-example.txt`, 'utf-8');
const input = readFileSync(`${pwd}/input.txt`, 'utf-8');

/** @param {string} rawInput */
function buildFilesystem(rawInput) {
    let currentDir = [];
    let nextCmd;
    const dirSizes = {};

    rawInput.split('\n').forEach((line) => {
        const cmdCd = /^\$ cd (?<cd>.+)/;
        const cmdLs = /^\$ ls$/;
        const cmdDir = /^dir (?<dir>\w+)/;
        const cmdFile = /^(?<size>\d+) (?<name>.+)/;

        if (nextCmd === 'ls') {
            const file = line.match(cmdFile)?.groups;
            const dir = line.match(cmdDir)?.groups?.dir || undefined;

            if (dir) {
                // we dont need this?
            }

            if (file) {
                const fileSize = parseInt(file.size);
                // const fileName = file.name;

                currentDir.reduce((memo, d) => {
                    const dir = `${memo}/${d}`.replace(/\/+/, '/');

                    if (!dirSizes[dir]) {
                        dirSizes[dir] = 0;
                    }

                    dirSizes[dir] += fileSize;

                    return dir;
                }, '');
            }
        }

        const cd = line.match(cmdCd)?.groups?.cd || undefined;
        const ls = cmdLs.test(line);

        if (cd) {
            nextCmd = 'cd';

            if (cd === '/') {
                currentDir = ['/'];
            } else if (cd === '..') {
                currentDir.pop();
            } else if (cd) {
                currentDir.push(cd);
            }
        }

        if (ls) {
            nextCmd = 'ls';
        }
    });

    const smallest = Object.values(dirSizes).filter((size) => size <= 100000);
    const sum = smallest.reduce((memo, size) => memo + size, 0);

    // part 1
    console.log('part 1:', sum);

    // part 2
    const diskSpace = 70000000;
    const neededUnusedspace = 30000000;
    const currentSpace = dirSizes['/'];
    const unusedSpace = diskSpace - currentSpace;
    const reqSpace = neededUnusedspace - unusedSpace;

    const sortedDirs = Object.entries(dirSizes).sort(
        ([, sizeA], [, sizeB]) => sizeA - sizeB
    );

    for (const [path, size] of sortedDirs) {
        if (reqSpace - size <= 0) {
            console.log('part 2: delete', path, 'with', size);
            break;
        }
    }
}

buildFilesystem(input);
