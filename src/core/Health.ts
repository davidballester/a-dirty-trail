class Health {
    private current: number;
    private max: number;

    constructor({ current, max }: { current: number; max: number }) {
        if (!Health.isValidRange(current, max)) {
            throw new Error('invalid range');
        }
        this.current = current;
        this.max = max;
    }

    getCurrent() {
        return this.current;
    }

    getMax() {
        return this.max;
    }

    isAlive() {
        return this.current > 0;
    }

    modify(delta: number) {
        this.current += delta;
        this.current = Math.min(this.current, this.getMax());
        this.current = Math.max(this.current, 0);
    }

    private static isValidRange(current, max) {
        const isCurrentPositive = current >= 0;
        const isMaxPositive = max >= 0;
        const isMaxHigherOrEqualToCurrent = max >= current;
        return (
            isCurrentPositive && isMaxPositive && isMaxHigherOrEqualToCurrent
        );
    }
}

export default Health;
