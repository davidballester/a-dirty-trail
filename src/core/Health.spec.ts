import Health from './Health';

describe('Health', () => {
    it('initializes without error', () => {
        new Health({ current: 0, max: 1 });
    });

    it('fails if the current is lower than 0', () => {
        expect(() => new Health({ current: -1, max: 0 })).toThrow();
    });

    it('fails if the max is lower than 0', () => {
        expect(() => new Health({ current: 0, max: -1 })).toThrow();
    });

    it('fails if the max is lower than the current', () => {
        expect(() => new Health({ current: 2, max: 1 })).toThrow();
    });

    it('gets the current', () => {
        const health = new Health({ current: 1, max: 2 });
        const current = health.getCurrent();
        expect(current).toEqual(1);
    });

    it('gets the max', () => {
        const health = new Health({ current: 1, max: 2 });
        const max = health.getMax();
        expect(max).toEqual(2);
    });

    describe('isAlive', () => {
        it('is alive if current is greater than 0', () => {
            const health = new Health({ current: 1, max: 1 });
            const isAlive = health.isAlive();
            expect(isAlive).toBeTruthy();
        });

        it('is not alive if current is 0', () => {
            const health = new Health({ current: 0, max: 1 });
            const isAlive = health.isAlive();
            expect(isAlive).toBeFalsy();
        });
    });

    describe('modify', () => {
        let health: Health;
        beforeEach(() => {
            health = new Health({ current: 5, max: 10 });
        });

        it('modifies the health within the range', () => {
            health.modify(3);
            const current = health.getCurrent();
            expect(current).toEqual(8);
        });

        it('does not exceed the max', () => {
            health.modify(10);
            const current = health.getCurrent();
            expect(current).toEqual(10);
        });

        it('does not goes below 0', () => {
            health.modify(-10);
            const current = health.getCurrent();
            expect(current).toEqual(0);
        });
    });
});
