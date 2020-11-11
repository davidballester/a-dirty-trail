import Trinket from './Trinket';

describe('Trinket', () => {
    it('initializes without errors', () => {
        new Trinket({ name: 'watch' });
    });

    describe('getName', () => {
        it('gets the name', () => {
            const trinket = new Trinket({ name: 'watch' });
            const name = trinket.getName();
            expect(name).toEqual('watch');
        });
    });

    describe('getDescription', () => {
        it('gets the description', () => {
            const trinket = new Trinket({
                name: 'watch',
                description: 'old and battered',
            });
            const description = trinket.getDescription();
            expect(description).toEqual('old and battered');
        });

        it('gets undefined if the trinket has no description', () => {
            const trinket = new Trinket({ name: 'watch' });
            const description = trinket.getDescription();
            expect(description).toBeUndefined();
        });
    });

    describe('getSkillsModifiers', () => {
        it('gets the modifiers', () => {
            const modifiers = { aim: 0.1 };
            const trinket = new Trinket({
                name: 'scope',
                skillsModifiers: modifiers,
            });
            const skillsModifiers = trinket.getSkillsModifiers();
            expect(skillsModifiers).toEqual(modifiers);
        });
    });
});
