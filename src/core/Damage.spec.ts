import Damage from './Damage';
import Random from './Random';

describe('Damage', () => {
    it('initializes without error', () => {
        new Damage({ min: 0, max: 1 });
    });

    it('fails if the min is lower than 0', () => {
        try {
            new Damage({ min: -1, max: 0 });
            fail('error expected');
        } catch (err) {}
    });

    it('fails if the max is lower than 0', () => {
        try {
            new Damage({ min: 0, max: -1 });
            fail('error expected');
        } catch (err) {}
    });

    it('fails if the max is lower than the min', () => {
        try {
            new Damage({ min: 2, max: 1 });
            fail('error expected');
        } catch (err) {}
    });

    describe('getMin', () => {
        it('returns the min', () => {
            const damage = new Damage({ min: 2, max: 4 });
            const min = damage.getMin();
            expect(min).toEqual(2);
        });
    });

    describe('getMax', () => {
        it('returns the max', () => {
            const damage = new Damage({ min: 2, max: 4 });
            const max = damage.getMax();
            expect(max).toEqual(4);
        });
    });

    describe('getRandomDamage', () => {
        let randomGetRandomInRange: jest.SpyInstance;
        let damage: Damage;
        beforeEach(() => {
            randomGetRandomInRange = jest.spyOn(Random, 'getRandomInRange');
            damage = new Damage({ min: 5, max: 10 });
        });

        it('returns the result of Random.getRandomInRange', () => {
            randomGetRandomInRange.mockReturnValue(11);
            const result = damage.getRandomDamage();
            expect(result).toEqual(11);
        });
    });
});
