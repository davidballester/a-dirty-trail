import Actor from './Actor';
import Damage from './Damage';
import Health from './Health';
import Inventory from './Inventory';
import Skill from './Skill';
import SkillSet from './SkillSet';
import Weapon from './Weapon';
import WeaponAmmunition from './WeaponAmmunition';

describe('Weapon', () => {
    let weapon: Weapon;
    let damage: Damage;
    let ammunition: WeaponAmmunition;
    beforeEach(() => {
        damage = new Damage({ min: 1, max: 2 });
        ammunition = new WeaponAmmunition({
            type: 'bullets',
            current: 6,
            max: 6,
        });
        weapon = new Weapon({
            name: 'revolver',
            type: 'gun',
            skill: 'aiming',
            damage,
            ammunition,
        });
    });

    describe('getName', () => {
        it('returns the name', () => {
            const name = weapon.getName();
            expect(name).toEqual('revolver');
        });
    });

    describe('changeName', () => {
        it('changes the name', () => {
            weapon.changeName('six-shooter');
            const name = weapon.getName();
            expect(name).toEqual('six-shooter');
        });
    });

    describe('getType', () => {
        it('returns the type', () => {
            const type = weapon.getType();
            expect(type).toEqual('gun');
        });
    });

    describe('getSkill', () => {
        it('returns the skill', () => {
            const skill = weapon.getSkill();
            expect(skill).toEqual('aiming');
        });
    });

    describe('getDamage', () => {
        it('returns the damage', () => {
            const returnedDamage = weapon.getDamage();
            expect(returnedDamage).toEqual(damage);
        });
    });

    describe('getAmmunition', () => {
        it('returns the ammunition', () => {
            const returnedAmmunition = weapon.getAmmunition();
            expect(returnedAmmunition).toEqual(ammunition);
        });

        it('returns undefined when the weapon does not use ammunition', () => {
            const weapon = new Weapon({
                name: 'club',
                type: 'hand-to-hand',
                skill: 'swing',
                damage,
            });
            const ammunition = weapon.getAmmunition();
            expect(ammunition).toBeUndefined();
        });
    });

    describe('canBeLooted', () => {
        it('returns true by default', () => {
            const canBeLooted = weapon.canBeLooted();
            expect(canBeLooted).toEqual(true);
        });

        it('returns false if specified as such', () => {
            weapon = new Weapon({
                name: 'revolver',
                type: 'gun',
                skill: 'aiming',
                damage,
                ammunition,
                canBeLooted: false,
            });
            const canBeLooted = weapon.canBeLooted();
            expect(canBeLooted).toEqual(false);
        });
    });

    describe('attack', () => {
        let aiming: Skill;
        let skillSet: SkillSet;
        let health: Health;
        let actor: Actor;
        let oponent: Actor;
        let damageGetRandomDamage: jest.SpyInstance;
        let skillRollSuccess: jest.SpyInstance;
        beforeEach(() => {
            aiming = new Skill({ name: 'aiming', probabilityOfSuccess: 0.4 });
            skillSet = new SkillSet({ skills: [aiming] });
            health = new Health({ current: 5, max: 5 });
            actor = new Actor({
                name: 'player',
                health,
                inventory: new Inventory({}),
                skillSet,
            });
            oponent = new Actor({
                name: 'player',
                health,
                inventory: new Inventory({}),
                skillSet: new SkillSet({}),
            });
            damageGetRandomDamage = jest.spyOn(damage, 'getRandomDamage');
            skillRollSuccess = jest.spyOn(aiming, 'rollSuccess');
        });

        describe('weapon with ammunition', () => {
            describe('successful attack', () => {
                beforeEach(() => {
                    damageGetRandomDamage.mockReturnValue(1);
                    skillRollSuccess.mockReturnValue(true);
                });

                it('reduces the ammunition of the weapon by 1', () => {
                    weapon.attack(actor, oponent);
                    const ammunition = weapon.getAmmunition()?.getCurrent();
                    expect(ammunition).toEqual(5);
                });

                it('reduces the health of the oponent by the damage', () => {
                    weapon.attack(actor, oponent);
                    const oponentHealth = oponent.getHealth().getCurrent();
                    expect(oponentHealth).toEqual(4);
                });

                it('returns hit', () => {
                    const outcome = weapon.attack(actor, oponent);
                    expect(outcome.type).toEqual('hit');
                });

                it('returns the damage', () => {
                    const outcome = weapon.attack(actor, oponent);
                    expect(outcome.damage).toEqual(1);
                });
            });

            describe('unsuccessful attack', () => {
                beforeEach(() => {
                    damageGetRandomDamage.mockReturnValue(2);
                    skillRollSuccess.mockReturnValue(false);
                });

                it('reduces the ammunition of the weapon by 1', () => {
                    weapon.attack(actor, oponent);
                    const ammunition = weapon.getAmmunition()?.getCurrent();
                    expect(ammunition).toEqual(5);
                });

                it('does not reduce the health of the oponent by the damage', () => {
                    weapon.attack(actor, oponent);
                    const oponentHealth = oponent.getHealth().getCurrent();
                    expect(oponentHealth).toEqual(5);
                });

                it('returns missed', () => {
                    const outcome = weapon.attack(actor, oponent);
                    expect(outcome.type).toEqual('missed');
                });

                it('returns the damage', () => {
                    const outcome = weapon.attack(actor, oponent);
                    expect(outcome.damage).toEqual(2);
                });
            });
        });

        describe('weapon without ammunition', () => {
            describe('successful attack', () => {
                beforeEach(() => {
                    weapon = new Weapon({
                        name: 'club',
                        type: 'hand-to-hand',
                        skill: 'aiming',
                        damage,
                    });
                    damageGetRandomDamage.mockReturnValue(1);
                    skillRollSuccess.mockReturnValue(true);
                });

                it('reduces the health of the oponent by the damage', () => {
                    weapon.attack(actor, oponent);
                    const oponentHealth = oponent.getHealth().getCurrent();
                    expect(oponentHealth).toEqual(4);
                });

                it('returns hit', () => {
                    const outcome = weapon.attack(actor, oponent);
                    expect(outcome.type).toEqual('hit');
                });

                it('returns the damage', () => {
                    const outcome = weapon.attack(actor, oponent);
                    expect(outcome.damage).toEqual(1);
                });
            });

            describe('unsuccessful attack', () => {
                beforeEach(() => {
                    damageGetRandomDamage.mockReturnValue(2);
                    skillRollSuccess.mockReturnValue(false);
                });

                it('does not reduce the health of the oponent by the damage', () => {
                    weapon.attack(actor, oponent);
                    const oponentHealth = oponent.getHealth().getCurrent();
                    expect(oponentHealth).toEqual(5);
                });

                it('returns missed', () => {
                    const outcome = weapon.attack(actor, oponent);
                    expect(outcome.type).toEqual('missed');
                });

                it('returns the damage', () => {
                    const outcome = weapon.attack(actor, oponent);
                    expect(outcome.damage).toEqual(2);
                });
            });
        });
    });

    describe('reload', () => {
        let ammunitionToReloadFrom: number;
        beforeEach(() => {
            ammunitionToReloadFrom = 50;
            ammunition = new WeaponAmmunition({
                type: 'bullets',
                current: 3,
                max: 6,
            });
            weapon = new Weapon({
                name: 'revolver',
                type: 'gun',
                skill: 'aiming',
                damage,
                ammunition,
            });
        });

        it('maxes the ammunition in the weapon', () => {
            weapon.reload(ammunitionToReloadFrom);
            const ammunition = weapon.getAmmunition()?.getCurrent();
            expect(ammunition).toEqual(weapon.getAmmunition()?.getMax());
        });

        it('reduces the source ammunition', () => {
            const remainingAmmunition = weapon.reload(ammunitionToReloadFrom);
            expect(remainingAmmunition).toEqual(47);
        });

        describe('weapon that does not use ammunition', () => {
            beforeEach(() => {
                weapon = new Weapon({
                    name: 'club',
                    type: 'hand-to-hand',
                    skill: 'swing',
                    damage,
                });
            });

            it('fails to reload', () => {
                try {
                    weapon.reload(ammunitionToReloadFrom);
                    fail('expected error');
                } catch (err) {}
            });
        });

        describe('ammunition already maxed out', () => {
            beforeEach(() => {
                ammunition = new WeaponAmmunition({
                    type: 'bullets',
                    current: 6,
                    max: 6,
                });
                weapon = new Weapon({
                    name: 'revolver',
                    type: 'gun',
                    skill: 'aiming',
                    damage,
                    ammunition,
                });
            });

            it('does not modify the ammunition in the weapon', () => {
                weapon.reload(ammunitionToReloadFrom);
                const ammunition = weapon.getAmmunition()?.getCurrent();
                expect(ammunition).toEqual(weapon.getAmmunition()?.getMax());
            });

            it('does not modify the source ammunition', () => {
                const remainingAmmunition = weapon.reload(
                    ammunitionToReloadFrom
                );
                expect(remainingAmmunition).toEqual(50);
            });
        });

        describe('insufficient ammunition', () => {
            beforeEach(() => {
                ammunitionToReloadFrom = 1;
            });

            it('increases the weapon ammunition by the available amount', () => {
                weapon.reload(ammunitionToReloadFrom);
                const ammunition = weapon.getAmmunition()?.getCurrent();
                expect(ammunition).toEqual(4);
            });

            it('reduces the source ammunition', () => {
                const remainingAmmunition = weapon.reload(
                    ammunitionToReloadFrom
                );
                expect(remainingAmmunition).toEqual(0);
            });
        });
    });

    describe('canAttack', () => {
        it('can attack if it does not use ammunition', () => {
            const club = new Weapon({
                name: 'club',
                type: 'hand-to-hand',
                skill: 'swing',
                damage,
            });
            const canAttack = club.canAttack();
            expect(canAttack).toEqual(true);
        });

        it('can attack if it has ammunition', () => {
            const revolver = new Weapon({
                name: 'revolver',
                type: 'gun',
                skill: 'aiming',
                ammunition,
                damage,
            });
            const canAttack = revolver.canAttack();
            expect(canAttack).toEqual(true);
        });

        it('can not attack if it has no ammunition', () => {
            const revolver = new Weapon({
                name: 'revolver',
                type: 'gun',
                skill: 'aiming',
                ammunition: new WeaponAmmunition({
                    type: 'bullets',
                    current: 0,
                    max: 6,
                }),
                damage,
            });
            const canAttack = revolver.canAttack();
            expect(canAttack).toEqual(false);
        });
    });
});
