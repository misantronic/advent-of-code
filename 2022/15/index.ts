import { lines, readFile } from '../utils';

const input = lines(readFile('input.txt'));

interface Point {
    x: number;
    y: number;
}

function equal(a?: Point, b?: Point) {
    return a?.x === b?.x && a?.y === b?.y;
}

const data: { sensor: Point; beacon: Point }[] = [];

input.map((line) => {
    const sensorMatches = line.match(
        /Sensor at x=(?<x>[-\d]+), y=(?<y>[-\d]+)/
    )?.groups;
    const beaconMatches = line.match(
        /closest beacon is at x=(?<x>[-\d]+), y=(?<y>[-\d]+)/
    )?.groups;

    const sensorX = Number(sensorMatches!.x);
    const sensorY = Number(sensorMatches!.y);

    const beaconX = Number(beaconMatches!.x);
    const beaconY = Number(beaconMatches!.y);

    data.push({
        sensor: { x: sensorX, y: sensorY },
        beacon: { x: beaconX, y: beaconY }
    });
});

const myData = data;
const coords = new Map<string, Point>();
const range = new Map<Point, number>();

myData.forEach(({ beacon, sensor }) => {
    const distance =
        Math.abs(beacon.x - sensor.x) + Math.abs(beacon.y - sensor.y);

    range.set(sensor, distance);
});

function draw() {
    const coordsX = [...coords].map(([_, p]) => p.x);
    const coordsY = [...coords].map(([_, p]) => p.y);

    const minX = Math.min(
        myData.reduce((x, a) => Math.min(x, a.beacon.x, a.sensor.x), Infinity),
        ...coordsX
    );
    const maxX = Math.max(
        myData.reduce((x, a) => Math.max(x, a.beacon.x, a.sensor.x), -Infinity),
        ...coordsX
    );
    const minY = Math.min(
        myData.reduce((y, a) => Math.min(y, a.beacon.y, a.sensor.y), Infinity),
        ...coordsY
    );
    const maxY = Math.max(
        myData.reduce((y, a) => Math.max(y, a.beacon.y, a.sensor.y), -Infinity),
        ...coordsY
    );

    const output: string[] = [];

    for (let y = minY; y <= maxY; y++) {
        const line: string[] = [`${y.toString().padStart(2, '0')} `];

        for (let x = minX; x <= maxX; x++) {
            const nonSignal = coords.get(`${x},${y}`);
            const sensor = myData.find(({ sensor }) => equal(sensor, { x, y }));
            const beacon = myData.find(({ beacon }) => equal(beacon, { x, y }));

            const char = (() => {
                if (beacon) {
                    return 'B';
                }

                if (sensor) {
                    return 'S';
                }

                if (nonSignal) {
                    return '#';
                }

                return '.';
            })();

            line.push(char);
        }

        output.push(line.join(''));
    }

    console.log(output.join('\n'));
}

function isBeaconOrSensor(p: Point) {
    return (
        myData.some(({ beacon }) => equal(beacon, p)) ||
        myData.some(({ sensor }) => equal(sensor, p))
    );
}

function getCoordY(y: number) {
    const coordSet = new Set<number>();

    [...range].forEach(([sensor, distance]) => {
        const cross: Point[] = [
            { x: sensor.x, y: sensor.y - distance },
            { x: sensor.x + distance, y: sensor.y },
            { x: sensor.x, y: sensor.y + distance },
            { x: sensor.x - distance, y: sensor.y }
        ];
        const [top, _, bottom, __] = cross;

        let sensorUp = 0;
        let numX = 0;

        if (y < top.y || y > bottom.y) {
            return;
        }

        if (y >= top.y && y <= sensor.y) {
            // top
            sensorUp = distance - (sensor.y - y);
        } else if (y > sensor.y && y <= bottom.y) {
            // bottom
            sensorUp = bottom.y - y;
        }

        numX = Math.abs(2 * sensorUp + 1);

        for (let i = 0; i <= numX / 2; i++) {
            const x1 = sensor.x + i;
            const x2 = sensor.x - i;

            [x1, x2].forEach((x) => {
                if (!isBeaconOrSensor({ x, y })) {
                    coordSet.add(x);
                }
            });
        }
    });

    return coordSet;
}

function part1() {
    return getCoordY(2000000).size;
}

function part2() {
    let val = 0;

    outer: for (let y = 4_000_000; y >= 0; y--) {
        const arr = [...getCoordY(y)].sort((a, b) => a - b);
        let prevX = Infinity;

        console.log('checking y:', y, 'x-elements:', arr.length);

        for (let x of arr) {
            if (prevX === Infinity) {
                prevX = x;
                continue;
            }

            const target = { x: prevX + 1, y };

            if (x !== target.x && !isBeaconOrSensor(target)) {
                val = target.x * 4_000_000 + target.y;
                break outer;
            }
            prevX = x;
        }
    }

    // const yRanges = new Set<number>();

    // const ys = [...yRanges]
    //     .filter((y) => y >= 0 && y <= 4_000_000)
    //     .sort((a, b) => b - a);

    // outer: for (const y of ys) {
    //     const arr = [...getCoordY(y)].sort((a, b) => a - b);

    //     let prevX = Infinity;

    //     console.log('checking y:', y, 'x-elements:', arr.length);

    //     for (let x of arr) {
    //         if (prevX === Infinity) {
    //             prevX = x;
    //             continue;
    //         }

    //         const target = { x: prevX + 1, y };

    //         if (x !== target.x && !isBeaconOrSensor(target)) {
    //             val = target.x * 4_000_000 + target.y;
    //             break outer;
    //         }
    //         prevX = x;
    //     }
    // }

    // return val;

    return val;
}

console.time('part 1');
console.log('part 1', part1());
console.timeEnd('part 1');

console.time('part 2');
console.log('part 2', part2());
console.timeEnd('part 2');
// wrong: 11_976_307_624_899
// wrong: 7_347_568_697_704
// right: 13_360_899_249_595

// console.log('');
// draw();
