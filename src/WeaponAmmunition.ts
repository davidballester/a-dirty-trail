class WeaponAmmunition {
    private type: string;
    private current: number;
    private max: number;

    constructor({
        type,
        current,
        max,
    }: {
        type: string;
        current: number;
        max: number;
    }) {
        if (!WeaponAmmunition.isValidRange(current, max)) {
            throw new Error('invalid range provided');
        }
        this.type = type;
        this.current = current;
        this.max = max;
    }

    getType() {
        return this.type;
    }

    getCurrent() {
        return this.current;
    }

    getMax() {
        return this.max;
    }

    modify(delta: number) {
        const newCurrent = this.current + delta;
        if (newCurrent < 0) {
            throw new Error('out of ammunition');
        }
        if (newCurrent > this.max) {
            throw new Error('quantity exceeds maximum');
        }
        this.current = newCurrent;
    }

    private static isValidRange(current: number, max: number): boolean {
        const minIsPositive = current >= 0;
        const maxIsPositive = max >= 0;
        const maxIsEqualToOrHigherThanMin = max >= current;
        return minIsPositive && maxIsPositive && maxIsEqualToOrHigherThanMin;
    }
}

export default WeaponAmmunition;
