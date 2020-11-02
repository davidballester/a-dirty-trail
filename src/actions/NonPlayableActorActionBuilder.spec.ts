import Actor from '../core/Actor';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';
import Weapon from '../core/Weapon';
import NonPlayableActorActionBuilder from './NonPlayableActorActionBuilder';
import AttackAction from './AttackAction';
import ReloadAction from './ReloadAction';
import LootAction from './LootAction';
jest.mock('./AttackAction');
jest.mock('./Reloadaction');
jest.mock('./LootAction');

describe('NonPlayableActorActionBuilder', () => {
    let sceneContainsActor: jest.SpyInstance;
    let sceneGetAliveActors: jest.SpyInstance;
    let sceneGetPlayer: jest.SpyInstance;
    let inventoryGetWeapons: jest.SpyInstance;
    let weaponGetAmmunition: jest.SpyInstance;
    let scene: Scene;
    let janeDoe: Actor;
    let johnDoeIsAlive: jest.SpyInstance;
    let johnDoeGetInventory: jest.SpyInstance;

    let johnDoe: NonPlayableActor;
    let weapon: Weapon;

    let attackActionMock: jest.Mock;
    let reloadActionMock: jest.Mock;
    let lootActionMock: jest.Mock;
    let attackActionCanExecute: jest.SpyInstance;
    let reloadActionCanExecute: jest.SpyInstance;
    let lootActionCanExecute: jest.SpyInstance;
    beforeEach(() => {
        weaponGetAmmunition = jest.fn().mockReturnValue(true);
        weapon = ({
            getAmmunition: weaponGetAmmunition,
        } as unknown) as Weapon;

        inventoryGetWeapons = jest.fn().mockReturnValue([weapon]);
        const inventory = {
            getWeapons: inventoryGetWeapons,
        };

        janeDoe = ({} as unknown) as Actor;

        sceneContainsActor = jest.fn().mockReturnValue(true);
        johnDoeIsAlive = jest.fn().mockReturnValue(true);
        johnDoeGetInventory = jest.fn().mockReturnValue(inventory);
        johnDoe = ({
            isAlive: johnDoeIsAlive,
            getInventory: johnDoeGetInventory,
        } as unknown) as NonPlayableActor;
        sceneGetAliveActors = jest.fn().mockReturnValue([johnDoe]);
        sceneGetPlayer = jest.fn().mockReturnValue(janeDoe);
        scene = ({
            containsActor: sceneContainsActor,
            getAliveActors: sceneGetAliveActors,
            getPlayer: sceneGetPlayer,
        } as unknown) as Scene;

        attackActionMock = (AttackAction as unknown) as jest.Mock;
        attackActionCanExecute = jest.fn().mockReturnValue(true);
        attackActionMock.mockImplementation(() => ({
            canExecute: attackActionCanExecute,
            getType: jest.fn().mockReturnValue(AttackAction.TYPE),
        }));

        reloadActionMock = (ReloadAction as unknown) as jest.Mock;
        reloadActionCanExecute = jest.fn().mockReturnValue(true);
        reloadActionMock.mockImplementation(() => ({
            canExecute: reloadActionCanExecute,
            getType: jest.fn().mockReturnValue(ReloadAction.TYPE),
        }));
        lootActionMock = (LootAction as unknown) as jest.Mock;
        lootActionCanExecute = jest.fn().mockReturnValue(true);
        lootActionMock.mockImplementation(() => ({
            canExecute: lootActionCanExecute,
            getType: jest.fn().mockReturnValue(LootAction.TYPE),
        }));
    });

    it('initializes without errors', () => {
        new NonPlayableActorActionBuilder({ actor: johnDoe, scene });
    });

    describe('buildActions', () => {
        let actionBuilder: NonPlayableActorActionBuilder;
        beforeEach(() => {
            actionBuilder = new NonPlayableActorActionBuilder({
                actor: johnDoe,
                scene,
            });
        });

        describe('attack actions', () => {
            it('creates an attack action with the expected arguments', () => {
                actionBuilder.buildActions();
                expect(attackActionMock).toHaveBeenCalledWith({
                    actor: johnDoe,
                    scene,
                    oponent: janeDoe,
                    weapon,
                });
            });

            it('returns an attack action', () => {
                const attackActions = actionBuilder
                    .buildActions()
                    .getAttackActions();
                expect(attackActions.length).toEqual(1);
            });

            it('does not return attack action if the attack action cannot be executed', () => {
                attackActionCanExecute.mockReturnValue(false);
                const attackActions = actionBuilder
                    .buildActions()
                    .getAttackActions();
                expect(attackActions.length).toEqual(0);
            });
        });
    });
});
