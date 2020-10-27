import Random from './Random';

class Damage {
    private min: number;
    private max: number;

    constructor({ min, max }: { min: number; max: number }) {
        if (!Damage.isValidRange(min, max)) {
            throw new Error('invalid range');
        }
        this.min = min;
        this.max = max;
    }

    getMin(): number {
        return this.min;
    }

    getMax(): number {
        return this.max;
    }

    getRandomDamage(): number {
        return Random.getRandomInRange(this.getMax(), this.getMin());
    }

    private static isValidRange(min: number, max: number): boolean {
        const minIsPositive = min >= 0;
        const maxIsPositive = max >= 0;
        const maxIsEqualToOrHigherThanMin = max >= min;
        return minIsPositive && maxIsPositive && maxIsEqualToOrHigherThanMin;
    }
}

export default Damage;
