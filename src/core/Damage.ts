import Random from './Random';

class Damage {
    private min: number;
    private max: number;

    constructor({ min, max }: { min: number; max: number }) {
        if (!Damage.isValidRange(min, max)) {
            throw new Error('invalid range provided');
        }
        this.min = min;
        this.max = max;
    }

    getMin() {
        return this.min;
    }

    getMax() {
        return this.max;
    }

    getRandomDamage() {
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
