import Actor from '../core/Actor';
import Damage from '../core/Damage';
import Health from '../core/Health';
import Inventory from '../core/Inventory';
import ReloadAction from './ReloadAction';
import Scene from '../core/Scene';
import SkillSet from '../core/SkillSet';
import WeaponAmmunition from '../core/WeaponAmmunition';
import Firearm from '../core/Firearm';

describe('ReloadAction', () => {
    let janeDoe: Actor;
    let revolver: Firearm;
    let inventory: Inventory;
    let scene: Scene;
    let sceneContainsActor: jest.SpyInstance;
    beforeEach(() => {
        inventory = new Inventory({
            ammunitionsByType: {
                bullets: 10,
            },
        });
        janeDoe = new Actor({
            name: 'Jane Doe',
            health: new Health({ current: 5, max: 5 }),
            inventory,
            skillSet: new SkillSet({}),
        });
        revolver = new Firearm({
            name: 'revolver',
            type: 'gun',
            skill: 'aiming',
            damage: new Damage({ min: 1, max: 2 }),
            ammunition: new WeaponAmmunition({
                type: 'bullets',
                current: 0,
                max: 6,
            }),
        });
        sceneContainsActor = jest.fn().mockReturnValue(true);
        scene = ({
            id: 'scene',
            containsActor: sceneContainsActor,
        } as unknown) as Scene;
    });

    it('initializes without errors', () => {
        new ReloadAction({
            scene,
            actor: janeDoe,
            weapon: revolver,
        });
    });

    describe('getWeapon', () => {
        it('returns the weapon', () => {
            const action = new ReloadAction({
                scene,
                actor: janeDoe,
                weapon: revolver,
            });
            const weapon = action.getWeapon();
            expect(weapon).toEqual(revolver);
        });
    });

    describe('canExecute', () => {
        let playerIsAlive: jest.SpyInstance;
        let inventoryGetAmmunitionsByType: jest.SpyInstance;
        let weaponGetAmmunition: jest.SpyInstance;
        let action: ReloadAction;
        beforeEach(() => {
            playerIsAlive = jest
                .spyOn(janeDoe, 'isAlive')
                .mockReturnValue(true);
            inventoryGetAmmunitionsByType = jest.spyOn(
                inventory,
                'getAmmunitionsByType'
            );
            weaponGetAmmunition = jest.spyOn(revolver, 'getAmmunition');
            action = new ReloadAction({
                scene,
                actor: janeDoe,
                weapon: revolver,
            });
        });

        it('returns false if the player is not alive', () => {
            playerIsAlive.mockReturnValue(false);
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the player is not in the scene', () => {
            sceneContainsActor.mockReturnValue(false);
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the weapon ammunition is maxed out', () => {
            weaponGetAmmunition.mockReturnValue(
                new WeaponAmmunition({ type: 'bullets', current: 6, max: 6 })
            );
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the inventory contains 0 of the weapon ammunition type', () => {
            inventoryGetAmmunitionsByType.mockReturnValue({ bullets: 0 });
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the inventory does not have the ammunition type', () => {
            inventoryGetAmmunitionsByType.mockReturnValue({});
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns true otherwise', () => {
            const canExecute = action.canExecute();
            expect(canExecute).toEqual(true);
        });
    });

    describe('execute', () => {
        let weaponReload: jest.SpyInstance;
        let action: ReloadAction;
        beforeEach(() => {
            weaponReload = jest.spyOn(revolver, 'reload').mockReturnValue(1);
            action = new ReloadAction({
                scene,
                actor: janeDoe,
                weapon: revolver,
            });
        });

        it('calls the reload method of the weapon', () => {
            action.execute();
            expect(weaponReload).toHaveBeenCalledWith(10);
        });

        it('sets the ammunition in the inventory to the response of the reload call', () => {
            action.execute();
            expect(inventory.getAmmunitionsByType()['bullets']).toEqual(1);
        });
    });
});
