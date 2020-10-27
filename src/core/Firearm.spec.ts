import Damage from './Damage';
import Firearm from './Firearm';
import WeaponAmmunition from './WeaponAmmunition';

describe(Firearm.name, () => {
    let firearm: Firearm;
    beforeEach(() => {
        firearm = new Firearm({
            name: 'revolver',
            type: 'gun',
            damage: new Damage({ min: 1, max: 2 }),
            skill: 'aim',
            ammunition: new WeaponAmmunition({
                type: 'bullets',
                current: 5,
                max: 6,
            }),
        });
    });

    describe('getAmmunition', () => {
        it('gets ammunition', () => {
            const ammunition = firearm.getAmmunition();
            expect(ammunition).toBeDefined();
        });
    });
});
