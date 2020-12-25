import Random from './Random';
import ThingWithId from './ThingWithId';

class Skill extends ThingWithId {
    private name: string;
    private probabilityOfSuccess: number;
    private levelUpDelta: number;

    constructor({
        name,
        probabilityOfSuccess,
        levelUpDelta = 0.02,
    }: {
        name: string;
        probabilityOfSuccess: number;
        levelUpDelta?: number;
    }) {
        super();
        if (!Skill.isLevelValid(probabilityOfSuccess)) {
            throw new Error('invalid probability');
        }
        this.name = name;
        this.probabilityOfSuccess = probabilityOfSuccess;
        this.levelUpDelta = levelUpDelta;
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
        const isSuccess = random <= level;
        if (isSuccess) {
            this.levelUp();
        }
        return isSuccess;
    }

    getLevelUpDelta(): number {
        return this.levelUpDelta;
    }

    private levelUp(): void {
        const random = Random.getRandom();
        const isLucky = random > this.probabilityOfSuccess;
        if (isLucky) {
            this.probabilityOfSuccess += this.levelUpDelta;
            this.probabilityOfSuccess = Math.min(this.probabilityOfSuccess, 1);
        }
    }

    private static isLevelValid(level): boolean {
        return level >= 0 && level <= 1;
    }
}

export default Skill;
