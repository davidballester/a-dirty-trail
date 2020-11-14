import Flags from './Flags';

describe(Flags.name, () => {
    let flags: Flags;
    beforeEach(() => {
        flags = new Flags({
            coins: 5,
            truthsayer: 1,
            reputation: -1,
            companions: 0,
        });
    });

    describe('getFlag', () => {
        it('retuns the flag', () => {
            const flag = flags.getFlag('coins');
            expect(flag).toEqual(5);
        });

        it('retuns 0 for an unknown flag', () => {
            const flag = flags.getFlag('notes');
            expect(flag).toEqual(0);
        });
    });

    describe('hasFlag', () => {
        it('retuns true for a flag with a positive value flag', () => {
            const hasFlag = flags.hasFlag('truthsayer');
            expect(hasFlag).toEqual(true);
        });

        it('retuns false for a flag with a negative value flag', () => {
            const hasFlag = flags.hasFlag('reputation');
            expect(hasFlag).toEqual(false);
        });

        it('retuns false for a flag with a value of 0', () => {
            const hasFlag = flags.hasFlag('companions');
            expect(hasFlag).toEqual(false);
        });
    });

    describe('addFlag', () => {
        it('adds a new flag with the default value of 1', () => {
            flags.addFlag('karma');
            const flag = flags.getFlag('karma');
            expect(flag).toEqual(1);
        });

        it('adds the default value of 1 to an existing flag', () => {
            flags.addFlag('coins');
            const flag = flags.getFlag('coins');
            expect(flag).toEqual(6);
        });

        it('adds the specified value to an existing flag', () => {
            flags.addFlag('coins', 2);
            const flag = flags.getFlag('coins');
            expect(flag).toEqual(7);
        });
    });

    describe('modifyFlag', () => {
        it('modifies an existing flag in the quantity specified', () => {
            flags.modifyFlag('coins', -2);
            const flag = flags.getFlag('coins');
            expect(flag).toEqual(3);
        });

        it('returns the final value of the flag', () => {
            const flag = flags.modifyFlag('coins', -2);
            expect(flag).toEqual(3);
        });

        it('sets a new flag with the specified value', () => {
            flags.modifyFlag('karma', 2);
            const flag = flags.getFlag('karma');
            expect(flag).toEqual(2);
        });
    });

    describe('removeFlag', () => {
        it('removes an existing flag', () => {
            flags.removeFlag('coins');
            const flag = flags.hasFlag('coins');
            expect(flag).toEqual(false);
        });

        it('removes a non existeng flag all the same', () => {
            flags.removeFlag('karma');
            const flag = flags.hasFlag('karma');
            expect(flag).toEqual(false);
        });
    });

    describe('getFlagMap', () => {
        it('returns the whole flag map', () => {
            const flagMap = flags.getFlagMap();
            expect(flagMap).toEqual({
                coins: 5,
                truthsayer: 1,
                reputation: -1,
                companions: 0,
            });
        });
    });
});
