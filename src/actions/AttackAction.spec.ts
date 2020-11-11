import { when } from 'jest-when';
import Actor from '../core/Actor';
import AttackAction from './AttackAction';
import Damage from '../core/Damage';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';
import SkillSet from '../core/SkillSet';
import Weapon, { AttackOutcome } from '../core/Weapon';
import WeaponAmmunition from '../core/WeaponAmmunition';

describe('AttackAction', () => {
    let janeDoe: Actor;
    let johnDoe: NonPlayableActor;
    let revolver: Weapon;
    let scene: Scene;
    beforeEach(() => {
        janeDoe = new Actor({
            name: 'Jane Doe',
            health: new Health({ current: 5, max: 5 }),
            inventory: new Inventory({}),
            skillSet: new SkillSet({}),
        });
        johnDoe = new NonPlayableActor({
            name: 'John Doe',
            health: new Health({ current: 5, max: 5 }),
            inventory: new Inventory({}),
            skillSet: new SkillSet({}),
        });
        revolver = new Weapon({
            name: 'revolver',
            type: 'gun',
            skill: 'aiming',
            damage: new Damage({ min: 1, max: 2 }),
            ammunition: new WeaponAmmunition({
                type: 'bullets',
                current: 6,
                max: 6,
            }),
        });
        scene = new Scene({
            id: 'foo',
            title: 'Foo',
            player: janeDoe,
            actors: [johnDoe],
            actions: [],
        });
    });

    it('initializes without errors', () => {
        new AttackAction({
            scene,
            actor: janeDoe,
            oponent: johnDoe,
            weapon: revolver,
        });
    });

    describe('getOponent', () => {
        it('returns the oponent', () => {
            const action = new AttackAction({
                scene,
                actor: janeDoe,
                oponent: johnDoe,
                weapon: revolver,
            });
            const oponent = action.getOponent();
            expect(oponent).toEqual(johnDoe);
        });
    });

    describe('getWeapon', () => {
        it('returns the weapon', () => {
            const action = new AttackAction({
                scene,
                actor: janeDoe,
                oponent: johnDoe,
                weapon: revolver,
            });
            const weapon = action.getWeapon();
            expect(weapon).toEqual(revolver);
        });
    });

    describe('canExecute', () => {
        let playerIsAlive: jest.SpyInstance;
        let sceneContainsActor: jest.SpyInstance;
        let oponentIsAlive: jest.SpyInstance;
        let weaponCanAttack: jest.SpyInstance;
        let action: AttackAction;
        beforeEach(() => {
            playerIsAlive = jest
                .spyOn(janeDoe, 'isAlive')
                .mockReturnValue(true);
            sceneContainsActor = jest
                .spyOn(scene, 'containsActor')
                .mockReturnValue(true);
            oponentIsAlive = jest
                .spyOn(johnDoe, 'isAlive')
                .mockReturnValue(true);
            weaponCanAttack = jest
                .spyOn(revolver, 'canAttack')
                .mockReturnValue(true);
            action = new AttackAction({
                scene,
                actor: janeDoe,
                oponent: johnDoe,
                weapon: revolver,
            });
        });

        it('returns false if the player is not alive', () => {
            playerIsAlive.mockReturnValue(false);
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the player is not in the scene', () => {
            when(sceneContainsActor).calledWith(janeDoe).mockReturnValue(false);
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the oponent is not alive', () => {
            oponentIsAlive.mockReturnValue(false);
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the oponent is not in the scene', () => {
            when(sceneContainsActor).calledWith(johnDoe).mockReturnValue(false);
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the weapon cannot attack', () => {
            weaponCanAttack.mockReturnValue(false);
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns true otherwise', () => {
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(true);
        });
    });

    describe('execute', () => {
        let weaponAttack: jest.SpyInstance;
        let attackOutcome: AttackOutcome;
        let action: AttackAction;
        beforeEach(() => {
            attackOutcome = { type: 'hit', damage: 5 };
            weaponAttack = jest
                .spyOn(revolver, 'attack')
                .mockReturnValue(attackOutcome);
            action = new AttackAction({
                scene,
                actor: janeDoe,
                oponent: johnDoe,
                weapon: revolver,
            });
        });

        it('calls the attack method of the weapon', () => {
            action.execute();
            expect(weaponAttack).toHaveBeenCalledWith(janeDoe, johnDoe);
        });

        it('returns the attack outcome', () => {
            const response = action.execute();
            expect(response).toEqual(attackOutcome);
        });
    });
});
