class Random {
    static getRandom(): number {
        return Math.random();
    }

    static getRandomInRange(min: number, max: number): number {
        const amplitude = max - min;
        const randomValueInAmplitude = Math.round(Math.random() * amplitude);
        const random = randomValueInAmplitude + min;
        return random;
    }
}

export default Random;
