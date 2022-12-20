import { lines, readFile } from '../utils';

const input = lines(readFile('input-example.txt'));

interface Resources {
    ore: number;
    clay: number;
    obsidian: number;
}

interface Blueprint {
    oreRobot: Resources;
    clayRobot: Resources;
    obsidianRobot: Resources;
    geodeRobot: Resources;
}

type RobotType = 'ore' | 'clay' | 'obsidian' | 'geode';

const blueprints = input.map<Blueprint>((line) => {
    const matched =
        line.match(
            /Each ore robot costs (?<oreRobotOre>\d+) ore\. Each clay robot costs (?<clayRobotOre>\d+) ore\. Each obsidian robot costs (?<obsidianRobotOre>\d+) ore and (?<obsidianRobotClay>\d+) clay\. Each geode robot costs (?<geodeRobotOre>\d+) ore and (?<geodeRobotObsidian>\d+) obsidian/
        )?.groups ?? {};

    return {
        oreRobot: { ore: Number(matched.oreRobotOre), clay: 0, obsidian: 0 },
        clayRobot: {
            ore: Number(matched.clayRobotOre),
            clay: 0,
            obsidian: 0
        },
        obsidianRobot: {
            ore: Number(matched.obsidianRobotOre),
            clay: Number(matched.obsidianRobotClay),
            obsidian: 0
        },
        geodeRobot: {
            ore: Number(matched.geodeRobotOre),
            clay: 0,
            obsidian: Number(matched.geodeRobotObsidian)
        }
    };
});

class Robot {
    public type: RobotType;

    constructor(type: RobotType) {
        this.type = type;
    }

    work(): Resources {
        return {
            clay: this.type === 'clay' ? 1 : 0,
            obsidian: this.type === 'obsidian' ? 1 : 0,
            ore: this.type === 'ore' ? 1 : 0
        };
    }

    static build(
        type: RobotType,
        blueprint: Blueprint,
        globalResources: Resources
    ) {
        const robot = new Robot(type);
        const neededResources = (() => {
            switch (type) {
                case 'clay':
                    return blueprint.clayRobot;
                case 'ore':
                    return blueprint.oreRobot;
                case 'obsidian':
                    return blueprint.obsidianRobot;
                case 'geode':
                    return blueprint.geodeRobot;
            }
        })();

        globalResources.clay -= neededResources.clay;
        globalResources.ore -= neededResources.ore;
        globalResources.obsidian -= neededResources.obsidian;

        return robot;
    }

    static canAfford(
        type: RobotType,
        blueprint: Blueprint,
        globalResources: Resources
    ) {
        const robot = (() => {
            switch (type) {
                case 'clay':
                    return blueprint.clayRobot;
                case 'ore':
                    return blueprint.oreRobot;
                case 'obsidian':
                    return blueprint.obsidianRobot;
                case 'geode':
                    return blueprint.geodeRobot;
            }
        })();

        return (
            globalResources.clay >= robot.clay &&
            globalResources.obsidian >= robot.obsidian &&
            globalResources.ore >= robot.ore
        );
    }
}

function workBlueprint(blueprint: Blueprint) {
    let timeLeft = 24;
    const robots = [new Robot('ore')];
    const resources: Resources = { ore: 0, clay: 0, obsidian: 0 };

    // goal
    let openGeodes = 0;

    // open geode by:
    // ore-robot + clay-robot
    //  -> obsidian-robot
    //      -> ore-robot + obsidian-robot
    //          -> geode-robot

    console.log({ blueprint });

    while (timeLeft) {
        robots.forEach((robot) => {
            const res = robot.work();

            resources.clay += res.clay;
            resources.ore += res.ore;
            resources.obsidian += res.obsidian;
        });

        openGeodes += robots.filter((robot) => robot.type === 'geode').length;

        // check what we need

        // produce

        if (Robot.canAfford('geode', blueprint, resources)) {
            robots.push(Robot.build('geode', blueprint, resources));
        }

        if (Robot.canAfford('obsidian', blueprint, resources)) {
            robots.push(Robot.build('obsidian', blueprint, resources));
        }

        if (Robot.canAfford('ore', blueprint, resources)) {
            robots.push(Robot.build('ore', blueprint, resources));
        }

        if (Robot.canAfford('clay', blueprint, resources)) {
            robots.push(Robot.build('clay', blueprint, resources));
        }

        timeLeft--;
    }

    console.log({ timeLeft, robots, resources, openGeodes });
}

function part1() {
    blueprints.forEach((blueprint) => {
        workBlueprint(blueprint);
    });
}

console.log('part 1', part1());
