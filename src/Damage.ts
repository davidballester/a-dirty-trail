class Damage {
    min: number;
    max: number;

    constructor({ min, max }: { min: number; max: number }) {
        if (!Damage.isValidRange(min, max)) {
            throw new Error('invalid range provided');
        }
        this.min = min;
        this.max = max;
    }

    getRandomDamage() {
        const amplitude = this.max - this.min;
        const randomValueInAmplitude = Math.round(Math.random() * amplitude);
        const randomDamage = randomValueInAmplitude + this.min;
        return randomDamage;
    }

    private static isValidRange(min: number, max: number): boolean {
        const minIsPositive = min >= 0;
        const maxIsPositive = max >= 0;
        const maxIsEqualToOrHigherThanMin = max >= min;
        return minIsPositive && maxIsPositive && maxIsEqualToOrHigherThanMin;
    }
}

export default Damage;
