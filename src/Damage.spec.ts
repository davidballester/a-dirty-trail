import Damage from './Damage';

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

    describe('isValidRange', () => {
        let mathRandom: jest.SpyInstance;
        let damage: Damage;
        beforeEach(() => {
            mathRandom = jest.spyOn(Math, 'random');
            damage = new Damage({ min: 5, max: 10 });
        });

        it('returns a value in the range', () => {
            new Array(10)
                .fill(null)
                .map((_, index) => parseInt(`0.${index}`))
                .forEach((value) => {
                    mathRandom.mockReturnValue(value);
                    const randomDamage = damage.getRandomDamage();
                    expect(randomDamage).toBeGreaterThanOrEqual(5);
                    expect(randomDamage).toBeLessThanOrEqual(10);
                });
        });
    });
});
