import { lines, readFile } from '../utils';

const input = readFile('./input-example.txt');
const ln = lines(input);

const seeds = ln[0].match(/\d+/g)?.map(Number) ?? [];

const getMap = (map: string) => {
    return lines(input.split('\n\n').filter((x) => x.includes(map))[0])
        .slice(1)
        .map((x) => x.split(' ').map(Number));
};

const seedToSoilMap = getMap('seed-to-soil map');
const soilToFertilizerMap = getMap('soil-to-fertilizer map');
const fertilizerToWaterMap = getMap('fertilizer-to-water map');
const waterToLightMap = getMap('water-to-light map');
const lightToTemperatureMap = getMap('light-to-temperature map');
const temperatureToHumidityMap = getMap('temperature-to-humidity map');
const humidityToLocationMap = getMap('humidity-to-location map');

seedToSoilMap.forEach(
    ([destinationRangeStart, sourceRangeStart, rangeLength]) => {
        const sourceRange = Array(rangeLength)
            .fill(0)
            .map((_, i) => sourceRangeStart + i);

        const destinationRange = Array(rangeLength)
            .fill(0)
            .map((_, i) => destinationRangeStart + i);

        console.log({
            destinationRangeStart,
            sourceRangeStart,
            rangeLength,
            sourceRange,
            destinationRange
        });
    }
);

// console.log(seeds);
