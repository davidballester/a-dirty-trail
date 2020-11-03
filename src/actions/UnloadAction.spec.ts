import Actor from '../core/Actor';
import Damage from '../core/Damage';
import Firearm from '../core/Firearm';
import Inventory from '../core/Inventory';
import Scene from '../core/Scene';
import WeaponAmmunition from '../core/WeaponAmmunition';
import UnloadAction from './UnloadAction';

describe(UnloadAction.name, () => {
    let revolver: Firearm;
    let unloadAction: UnloadAction;
    let inventory: Inventory;
    let sceneContainsActor: jest.SpyInstance;
    let playerIsAlive: jest.SpyInstance;
    beforeEach(() => {
        sceneContainsActor = jest.fn().mockReturnValue(true);
        const scene = ({
            containsActor: sceneContainsActor,
        } as unknown) as Scene;
        revolver = new Firearm({
            name: 'revolver',
            type: 'revolver',
            skill: 'aim',
            damage: new Damage({ min: 1, max: 2 }),
            ammunition: new WeaponAmmunition({
                type: 'bullets',
                current: 3,
                max: 6,
            }),
        });
        inventory = new Inventory({ ammunitionsByType: {} });
        playerIsAlive = jest.fn().mockReturnValue(true);
        const actor = ({
            getInventory: jest.fn().mockReturnValue(inventory),
            isAlive: playerIsAlive,
        } as unknown) as Actor;
        unloadAction = new UnloadAction({
            scene,
            actor,
            weapon: revolver,
        });
    });

    describe('getWeapon', () => {
        it('returns the weapon', () => {
            const weapon = unloadAction.getWeapon();
            expect(weapon).toEqual(revolver);
        });
    });

    describe('canExecute', () => {
        it('returns false if the player is not alive', () => {
            playerIsAlive.mockReturnValue(false);
            const canExecute = unloadAction.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the player is not in the scene', () => {
            sceneContainsActor.mockReturnValue(false);
            const canExecute = unloadAction.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the weapon ammunition is depleted', () => {
            revolver
                .getAmmunition()
                .modify(-revolver.getAmmunition().getCurrent());
            const canExecute = unloadAction.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns true otherwise', () => {
            const canExecute = unloadAction.canExecute();
            expect(canExecute).toEqual(true);
        });
    });

    describe('execute', () => {
        beforeEach(() => {
            unloadAction.execute();
        });

        it('depletes the weapon ammunition', () => {
            expect(revolver.getAmmunition().getCurrent()).toEqual(0);
        });

        it('adds the ammunition of the weapon to the actor inventory', () => {
            expect(
                inventory.getAmmunitionsByType()[
                    revolver.getAmmunition().getType()
                ]
            ).toEqual(3);
        });
    });
});
