import Random from './Random';
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
            throw new Error('invalid probability');
        }
        this.name = name;
        this.probabilityOfSuccess = probabilityOfSuccess;
    }

    getName(): string {
        return this.name;
    }

    getProbabilityOfSuccess(): number {
        return this.probabilityOfSuccess;
    }

    setProbabilityOfSuccess(newProbabilityOfSuccess: number): void {
        this.probabilityOfSuccess = newProbabilityOfSuccess;
    }

    modifyProbabilityOfSuccess(delta: number): number {
        let newProbabilityOfSucess = this.probabilityOfSuccess + delta;
        if (newProbabilityOfSucess > 1) {
            newProbabilityOfSucess = 1;
        } else if (newProbabilityOfSucess < 0) {
            newProbabilityOfSucess = 0;
        }
        this.setProbabilityOfSuccess(newProbabilityOfSucess);
        return this.probabilityOfSuccess;
    }

    rollSuccessWithModifier(modifier: number): boolean {
        const level = this.getProbabilityOfSuccess() + modifier;
        const random = Random.getRandom();
        return random <= level;
    }

    private static isLevelValid(level): boolean {
        return level >= 0 && level <= 1;
    }
}

export default Skill;
