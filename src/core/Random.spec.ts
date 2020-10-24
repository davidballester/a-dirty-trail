import Random from './Random';

describe('Random', () => {
    let mathRandom: jest.SpyInstance;
    beforeEach(() => {
        mathRandom = jest.spyOn(Math, 'random');
    });

    describe('getRandom', () => {
        it('returns the result of Math.random', () => {
            mathRandom.mockReturnValue(0.99);
            const result = Random.getRandom();
            expect(result).toEqual(0.99);
        });
    });

    describe('getRandomInRange', () => {
        let min: number;
        let max: number;
        beforeEach(() => {
            min = 5;
            max = 10;
        });

        it('returns the minimum when random is 0', () => {
            mathRandom.mockReturnValue(0);
            const result = Random.getRandomInRange(min, max);
            expect(result).toEqual(min);
        });

        it('returns the maximum when random is 1', () => {
            mathRandom.mockReturnValue(1);
            const result = Random.getRandomInRange(min, max);
            expect(result).toEqual(max);
        });

        it('returns the middle point when random is 0.5', () => {
            mathRandom.mockReturnValue(0.5);
            const result = Random.getRandomInRange(min, max);
            expect(result).toEqual(Math.round(7.5));
        });
    });
});
