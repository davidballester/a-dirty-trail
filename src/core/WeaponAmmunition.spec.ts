import WeaponAmmunition from './WeaponAmmunition';

describe('WeaponAmmunition', () => {
    it('initializes without error', () => {
        new WeaponAmmunition({ type: 'bullets', current: 0, max: 1 });
    });

    it('fails if the min is lower than 0', () => {
        expect(
            () => new WeaponAmmunition({ type: 'bullets', current: -1, max: 0 })
        ).toThrow();
    });

    it('fails if the max is lower than 0', () => {
        expect(
            () => new WeaponAmmunition({ type: 'bullets', current: 0, max: -1 })
        ).toThrow();
    });

    it('fails if the max is lower than the min', () => {
        expect(
            () => new WeaponAmmunition({ type: 'bullets', current: 2, max: 1 })
        ).toThrow();
    });

    describe('getType', () => {
        it('returns the type', () => {
            const weaponAmmunition = new WeaponAmmunition({
                type: 'bullets',
                current: 2,
                max: 4,
            });
            const type = weaponAmmunition.getType();
            expect(type).toEqual('bullets');
        });
    });

    describe('getMin', () => {
        it('returns the min', () => {
            const weaponAmmunition = new WeaponAmmunition({
                type: 'bullets',
                current: 2,
                max: 4,
            });
            const min = weaponAmmunition.getCurrent();
            expect(min).toEqual(2);
        });
    });

    describe('getMax', () => {
        it('returns the max', () => {
            const weaponAmmunition = new WeaponAmmunition({
                type: 'bullets',
                current: 2,
                max: 4,
            });
            const max = weaponAmmunition.getMax();
            expect(max).toEqual(4);
        });
    });

    describe('modify', () => {
        let weaponAmmunition: WeaponAmmunition;
        beforeEach(() => {
            weaponAmmunition = new WeaponAmmunition({
                type: 'bullets',
                current: 1,
                max: 5,
            });
        });

        it('modifies the ammunition within the range', () => {
            weaponAmmunition.modify(3);
            const current = weaponAmmunition.getCurrent();
            expect(current).toEqual(4);
        });

        it('throws an error if the modification would exceed the max', () => {
            expect(() => weaponAmmunition.modify(10)).toThrow();
        });

        it('does not modify the ammunition if an errors is thrown because the max is exceeded', () => {
            try {
                weaponAmmunition.modify(10);
            } catch (err) {}
            const current = weaponAmmunition.getCurrent();
            expect(current).toEqual(1);
        });

        it('throws an error if the modification would lower below 0', () => {
            expect(() => weaponAmmunition.modify(-2)).toThrow();
        });

        it('does not modify the ammunition if an errors is thrown because the result would be below 0', () => {
            try {
                weaponAmmunition.modify(-2);
            } catch (err) {}
            const current = weaponAmmunition.getCurrent();
            expect(current).toEqual(1);
        });
    });

    describe('isSpent', () => {
        it('returns true for current 0', () => {
            const weaponAmmunition = new WeaponAmmunition({
                type: 'bullets',
                current: 0,
                max: 1,
            });
            const isSpent = weaponAmmunition.isSpent();
            expect(isSpent).toEqual(true);
        });

        it('returns false for current 1', () => {
            const weaponAmmunition = new WeaponAmmunition({
                type: 'bullets',
                current: 1,
                max: 1,
            });
            const isSpent = weaponAmmunition.isSpent();
            expect(isSpent).toEqual(false);
        });
    });
});
