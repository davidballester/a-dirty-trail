import ThingWithId from './ThingWithId';

class Skill extends ThingWithId {
    private name: string;
    private probabilityOfSuccess: number;

    constructor({
        name,
        probabilityOfSuccess,
    }: {
        name: string;
        probabilityOfSuccess: number;
    }) {
        super();
        if (!Skill.isLevelValid(probabilityOfSuccess)) {
            throw new Error('level must be between 0 and 1');
        }
        this.name = name;
        this.probabilityOfSuccess = probabilityOfSuccess;
    }

    getName() {
        return this.name;
    }

    getProbabilityOfSuccess() {
        return this.probabilityOfSuccess;
    }

    rollSuccess(): boolean {
        return this.rollSuccessWithOpposition(0);
    }

    rollSuccessWithOpposition(opposition: number): boolean {
        const level = this.getProbabilityOfSuccess() - opposition;
        const random = Math.random();
        return random <= level;
    }

    private static isLevelValid(level): boolean {
        return level >= 0 && level <= 1;
    }
}

export default Skill;
