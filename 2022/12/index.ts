import { lines, readFile } from '../utils';

interface Point {
    x: number;
    y: number;
    char: string;
    height: number;
}

const input = lines(readFile('input-example.txt'));
const grid: Point[] = [];

function equal(a?: Point, b?: Point) {
    return a?.x === b?.x && a?.y === b?.y;
}

function S() {
    return grid.find((p) => p.char === 'S')!;
}

function E() {
    return grid.find((p) => p.char === 'E')!;
}

function getNeighbors(point: Point) {
    return [
        grid.find((p) => p.x === point.x && p.y === point.y - 1),
        grid.find((p) => p.x === point.x + 1 && p.y === point.y),
        grid.find((p) => p.x === point.x && p.y === point.y + 1),
        grid.find((p) => p.x === point.x - 1 && p.y === point.y)
    ]
        .filter((p) => !equal(p, S()))
        .filter((p) => !equal(p, E()))
        .filter((p) => p !== point)
        .filter(Boolean) as Point[];
}

input.map((rawLine, y) => {
    const chars = [...rawLine];

    chars.map((char, x) => {
        const height = ((char: string) => {
            if (char === 'S') char = 'a';
            if (char === 'E') char = 'z';

            return char.charCodeAt(0) - 96;
        })(char);

        grid.push({ x, y, char, height });
    });
});

function dijkstra(start: Point) {
    const path = [start];

    const distances = grid.map((point) => ({
        distance: equal(point, start) ? 0 : Infinity,
        point
    }));

    let unvisitedNodes = grid.filter((p) => !equal(p, start));

    const queue = [start];

    let i = 0;

    while (queue.length) {
        if (i === 3) {
            break;
        }
        i++;
        console.log('route', i);

        path.map((pathPoint) => {
            const neighborDistances = getNeighbors(pathPoint)
                .filter((p) =>
                    distances.some(
                        ({ distance, point }) =>
                            equal(p, point) && distance === Infinity
                    )
                )
                .map((neighbor) => {
                    const distance = distances.find((p) =>
                        equal(p.point, neighbor)
                    )!;

                    const edgeDistance = path
                        .filter((_, i) => i !== 0)
                        .map((p) => p.height)
                        .reduce((a, b) => a + b, 0);

                    distance.distance = edgeDistance + neighbor.height;

                    return distance;
                });

            console.log({ neighborDistances });

            const closestDistance = [...neighborDistances]
                .sort((a, b) => a.distance - b.distance)
                .at(0);

            if (closestDistance) {
                unvisitedNodes = unvisitedNodes.filter(
                    (p) => !equal(p, closestDistance.point)
                );

                path.push(closestDistance.point);
            }
        });
    }

    console.log(distances, path);
}

dijkstra(S());
