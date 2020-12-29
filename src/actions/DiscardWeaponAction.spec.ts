import Actor from '../core/Actor';
import Damage from '../core/Damage';
import Firearm from '../core/Firearm';
import Inventory from '../core/Inventory';
import Scene from '../core/Scene';
import Weapon from '../core/Weapon';
import WeaponAmmunition from '../core/WeaponAmmunition';
import DiscardWeaponAction from './DiscardWeaponAction';

describe(DiscardWeaponAction.name, () => {
    let revolver: Firearm;
    let club: Weapon;
    let knife: Weapon;
    let discardWeaponAction: DiscardWeaponAction;
    let inventory: Inventory;
    let scene: Scene;
    let sceneContainsActor: jest.SpyInstance;
    let actor: Actor;
    let playerIsAlive: jest.SpyInstance;
    beforeEach(() => {
        sceneContainsActor = jest.fn().mockReturnValue(true);
        scene = ({
            containsActor: sceneContainsActor,
        } as unknown) as Scene;

        revolver = new Firearm({
            name: 'revolver',
            type: 'revolver',
            skill: 'aim',
            damage: new Damage({ min: 1, max: 2 }),
            ammunition: new WeaponAmmunition({
                type: 'bullets',
                current: 4,
                max: 6,
            }),
        });

        club = new Weapon({
            name: 'club',
            type: 'club',
            skill: 'swing',
            damage: new Damage({ min: 1, max: 1 }),
        });

        knife = new Weapon({
            name: 'knife',
            type: 'knife',
            skill: 'stab',
            damage: new Damage({ min: 1, max: 1 }),
        });

        inventory = new Inventory({ weapons: [revolver, club, knife] });
        playerIsAlive = jest.fn().mockReturnValue(true);
        actor = ({
            getInventory: () => inventory,
            isAlive: playerIsAlive,
        } as unknown) as Actor;
        discardWeaponAction = new DiscardWeaponAction({
            scene,
            actor,
            weapon: revolver,
        });
    });

    describe('getWeapon', () => {
        it('returns the weapon', () => {
            const weapon = discardWeaponAction.getWeapon();
            expect(weapon).toEqual(revolver);
        });
    });

    describe('canExecute', () => {
        it('returns false if the player is not alive', () => {
            playerIsAlive.mockReturnValue(false);
            const canExecute = discardWeaponAction.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the player is not in the scene', () => {
            sceneContainsActor.mockReturnValue(false);
            const canExecute = discardWeaponAction.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns false if the weapon is the last weapon without ammunition', () => {
            inventory = new Inventory({ weapons: [revolver, knife] });
            discardWeaponAction = new DiscardWeaponAction({
                scene,
                actor,
                weapon: knife,
            });
            const canExecute = discardWeaponAction.canExecute();
            expect(canExecute).toEqual(false);
        });

        it('returns true if there are other weapons without ammunition', () => {
            inventory = new Inventory({ weapons: [club, knife] });
            discardWeaponAction = new DiscardWeaponAction({
                scene,
                actor,
                weapon: knife,
            });
            const canExecute = discardWeaponAction.canExecute();
            expect(canExecute).toEqual(true);
        });

        it('returns true otherwise', () => {
            const canExecute = discardWeaponAction.canExecute();
            expect(canExecute).toEqual(true);
        });
    });

    describe('execute', () => {
        beforeEach(() => {
            discardWeaponAction.execute();
        });

        it('removes the weapon from the inventory', () => {
            const weapons = inventory.getWeapons();
            expect(weapons).toEqual([club, knife]);
        });
    });
});
