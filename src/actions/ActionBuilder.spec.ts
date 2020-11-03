import Actor from '../core/Actor';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';
import Weapon from '../core/Weapon';
import ActionBuilder from './ActionBuilder';
import AttackAction from './AttackAction';
import ReloadAction from './ReloadAction';
import UnloadAction from './UnloadAction';
import DiscardWeaponAction from './DiscardWeaponAction';
import LootAction from './LootAction';
jest.mock('./AttackAction');
jest.mock('./ReloadAction');
jest.mock('./UnloadAction');
jest.mock('./DiscardWeaponAction');
jest.mock('./LootAction');

describe('ActionBuilder', () => {
    let sceneContainsActor: jest.SpyInstance;
    let sceneGetAliveActors: jest.SpyInstance;
    let sceneGetDeadActors: jest.SpyInstance;
    let sceneGetActions: jest.SpyInstance;
    let janeDoeIsAlive: jest.SpyInstance;
    let janeDoeGetInventory: jest.SpyInstance;
    let inventoryGetWeapons: jest.SpyInstance;
    let weaponGetAmmunition: jest.SpyInstance;
    let scene: Scene;
    let janeDoe: Actor;
    let johnDoe: NonPlayableActor;
    let jillBloggs: NonPlayableActor;
    let weapon: Weapon;

    let attackActionMock: jest.Mock;
    let reloadActionMock: jest.Mock;
    let unloadActionMock: jest.Mock;
    let discardWeaponActionMock: jest.Mock;
    let lootActionMock: jest.Mock;
    let attackActionCanExecute: jest.SpyInstance;
    let reloadActionCanExecute: jest.SpyInstance;
    let unloadActionCanExecute: jest.SpyInstance;
    let discardWeaponActionCanExecute: jest.SpyInstance;
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

        janeDoeIsAlive = jest.fn().mockReturnValue(true);
        janeDoeGetInventory = jest.fn().mockReturnValue(inventory);
        janeDoe = ({
            isAlive: janeDoeIsAlive,
            getInventory: janeDoeGetInventory,
        } as unknown) as Actor;

        sceneContainsActor = jest.fn().mockReturnValue(true);
        johnDoe = {} as NonPlayableActor;
        sceneGetAliveActors = jest.fn().mockReturnValue([johnDoe]);
        jillBloggs = {} as NonPlayableActor;
        sceneGetDeadActors = jest.fn().mockReturnValue([jillBloggs]);
        sceneGetActions = jest.fn().mockReturnValue([]);
        scene = ({
            containsActor: sceneContainsActor,
            getAliveActors: sceneGetAliveActors,
            getDeadActors: sceneGetDeadActors,
            getActions: sceneGetActions,
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

        unloadActionMock = (UnloadAction as unknown) as jest.Mock;
        unloadActionCanExecute = jest.fn().mockReturnValue(true);
        unloadActionMock.mockImplementation(() => ({
            canExecute: unloadActionCanExecute,
            getType: jest.fn().mockReturnValue(UnloadAction.TYPE),
        }));

        discardWeaponActionMock = (DiscardWeaponAction as unknown) as jest.Mock;
        discardWeaponActionCanExecute = jest.fn().mockReturnValue(true);
        discardWeaponActionMock.mockImplementation(() => ({
            canExecute: discardWeaponActionCanExecute,
            getType: jest.fn().mockReturnValue(DiscardWeaponAction.TYPE),
        }));

        lootActionMock = (LootAction as unknown) as jest.Mock;
        lootActionCanExecute = jest.fn().mockReturnValue(true);
        lootActionMock.mockImplementation(() => ({
            canExecute: lootActionCanExecute,
            getType: jest.fn().mockReturnValue(LootAction.TYPE),
        }));
    });

    it('initializes without errors', () => {
        new ActionBuilder({ actor: janeDoe, scene });
    });

    describe('buildActions', () => {
        let actionBuilder: ActionBuilder;
        beforeEach(() => {
            actionBuilder = new ActionBuilder({ actor: janeDoe, scene });
        });

        describe('attack actions', () => {
            it('creates an attack action with the expected arguments', () => {
                actionBuilder.buildActions();
                expect(attackActionMock).toHaveBeenCalledWith({
                    actor: janeDoe,
                    scene,
                    oponent: johnDoe,
                    weapon,
                });
            });

            it('returns an attack action', () => {
                const attackActions = actionBuilder
                    .buildActions()
                    .getAttackActions();
                expect(attackActions.length).toEqual(1);
            });

            it('does not return attack action if there are no oponents alive', () => {
                sceneGetAliveActors.mockReturnValue([]);
                const attackActions = actionBuilder
                    .buildActions()
                    .getAttackActions();
                expect(attackActions.length).toEqual(0);
            });

            it('does not return attack action if the attack action cannot be executed', () => {
                attackActionCanExecute.mockReturnValue(false);
                const attackActions = actionBuilder
                    .buildActions()
                    .getAttackActions();
                expect(attackActions.length).toEqual(0);
            });
        });

        describe('reload actions', () => {
            it('creates a reload action with the expected arguments', () => {
                actionBuilder.buildActions();
                expect(reloadActionMock).toHaveBeenCalledWith({
                    actor: janeDoe,
                    scene,
                    weapon,
                });
            });

            it('returns a reload action', () => {
                const reloadActions = actionBuilder
                    .buildActions()
                    .getReloadActions();
                expect(reloadActions.length).toEqual(1);
            });

            it('does not return a reload action if the weapon does not use ammunition', () => {
                weaponGetAmmunition.mockReturnValue(false);
                const reloadActions = actionBuilder
                    .buildActions()
                    .getReloadActions();
                expect(reloadActions.length).toEqual(0);
            });

            it('does not return the reload action if it cannot be executed', () => {
                reloadActionCanExecute.mockReturnValue(false);
                const reloadActions = actionBuilder
                    .buildActions()
                    .getReloadActions();
                expect(reloadActions.length).toEqual(0);
            });
        });

        describe('unload actions', () => {
            it('creates an unload action with the expected arguments', () => {
                actionBuilder.buildActions();
                expect(unloadActionMock).toHaveBeenCalledWith({
                    actor: janeDoe,
                    scene,
                    weapon,
                });
            });

            it('returns an unload action', () => {
                const unloadActions = actionBuilder
                    .buildActions()
                    .getUnloadActions();
                expect(unloadActions.length).toEqual(1);
            });

            it('does not return an unload action if the weapon does not use ammunition', () => {
                weaponGetAmmunition.mockReturnValue(false);
                const unloadActions = actionBuilder
                    .buildActions()
                    .getUnloadActions();
                expect(unloadActions.length).toEqual(0);
            });

            it('does not return the unload action if it cannot be executed', () => {
                unloadActionCanExecute.mockReturnValue(false);
                const unloadActions = actionBuilder
                    .buildActions()
                    .getUnloadActions();
                expect(unloadActions.length).toEqual(0);
            });
        });

        describe('discard weapon actions', () => {
            it('creates a discard weapon action with the expected arguments', () => {
                actionBuilder.buildActions();
                expect(discardWeaponActionMock).toHaveBeenCalledWith({
                    actor: janeDoe,
                    scene,
                    weapon,
                });
            });

            it('returns a discard weapon action', () => {
                const discardWeaponActions = actionBuilder
                    .buildActions()
                    .getDiscardWeaponActions();
                expect(discardWeaponActions.length).toEqual(1);
            });

            it('does not return the discard weapon if it cannot be executed', () => {
                discardWeaponActionCanExecute.mockReturnValue(false);
                const discardWeaponActions = actionBuilder
                    .buildActions()
                    .getDiscardWeaponActions();
                expect(discardWeaponActions.length).toEqual(0);
            });
        });

        describe('loot actions', () => {
            it('creates a loot action with the expected arguments', () => {
                actionBuilder.buildActions();
                expect(lootActionMock).toHaveBeenCalledWith({
                    actor: janeDoe,
                    scene,
                    oponent: johnDoe,
                });
            });

            it('returns a loot action', () => {
                const lootActions = actionBuilder
                    .buildActions()
                    .getLootActions();
                expect(lootActions.length).toEqual(1);
            });

            it('does not return a loot action if there are no oponents dead', () => {
                sceneGetDeadActors.mockReturnValue([]);
                const lootActions = actionBuilder
                    .buildActions()
                    .getLootActions();
                expect(lootActions.length).toEqual(0);
            });

            it('does not return attack action if the loot action cannot be executed', () => {
                lootActionCanExecute.mockReturnValue(false);
                const lootActions = actionBuilder
                    .buildActions()
                    .getLootActions();
                expect(lootActions.length).toEqual(0);
            });
        });
    });
});
