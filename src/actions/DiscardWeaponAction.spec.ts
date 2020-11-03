import Actor from '../core/Actor';
import Firearm from '../core/Firearm';
import Inventory from '../core/Inventory';
import Scene from '../core/Scene';
import Weapon from '../core/Weapon';
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

        revolver = ({
            getAmmunition: jest.fn().mockReturnValue({}),
            equals: (candidate) => candidate === revolver,
        } as unknown) as Firearm;

        club = ({
            getAmmunition: jest.fn().mockReturnValue(undefined),
            equals: (candidate) => candidate === club,
        } as unknown) as Weapon;

        knife = ({
            getAmmunition: jest.fn().mockReturnValue(undefined),
            equals: (candidate) => candidate === knife,
        } as unknown) as Weapon;

        inventory = new Inventory({ weapons: [revolver, club, knife] });
        playerIsAlive = jest.fn().mockReturnValue(true);
        actor = ({
            getInventory: jest.fn().mockReturnValue(inventory),
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

        it('returns false if the weapon does not use ammunition and the inventory does not have any other weapon that does not use ammunition', () => {
            inventory = new Inventory({ weapons: [revolver, knife] });
            discardWeaponAction = new DiscardWeaponAction({
                scene,
                actor,
                weapon: knife,
            });
            const canExecute = discardWeaponAction.canExecute();
            expect(canExecute).toEqual(false);
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
