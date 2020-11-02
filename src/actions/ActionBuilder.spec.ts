import Actor from '../core/Actor';
import NonPlayableActor from '../core/NonPlayableActor';
import Scene from '../core/Scene';
import Weapon from '../core/Weapon';
import ActionBuilder from './ActionBuilder';
import AttackAction from './AttackAction';
import ReloadAction from './ReloadAction';
import LootAction from './LootAction';
jest.mock('./AttackAction');
jest.mock('./Reloadaction');
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
